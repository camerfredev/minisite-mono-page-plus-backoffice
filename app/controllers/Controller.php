<?php

//! controler de base, dont héritent tout les autres
class Controller
{
    protected $db;//reference a la base de donnée
    protected $f3;//objet de base du fate free framework
    public $siteName = "framasite";//nom du site
    // TODO : c'est cette variable qu'il faudra rendre dynamique pour switcher d'un site a l'autre

    //! HTTP route pre-processor
    public function beforeroute()
    {
        //on viens récuperer les info a partir du info.json
        $siteConfigPath = $this->f3->get('SitesFolder') . $this->siteName . '/config.json';
        if (!file_exists($siteConfigPath)) {
            $this->f3->error(404, "Erreur 404: Site non trouvé");
        }
        $siteConfig = json_decode(
            file_get_contents($siteConfigPath),
            true
        );
        //on recuper le fichier config spécifique au site regardé
        foreach ($siteConfig as $key => $value) {
            $this->f3->set($key, $value);
        }
        if ($this->isAdmin()) {
            //si l'user est admin, on commence par passer cette variable a true,
            // elle sera utilisée un peu partout par la suite
            $this->f3->set('isAdmin', true);
        }
        // on finit par connecter a la base de donnée du site de manière dynamique
        $this->db = new \DB\Jig(
            $this->f3->get('SitesFolder') . $this->siteName . '/data/',
            $format = \DB\Jig::FORMAT_JSON
        );
    }

    //! HTTP route post-processor
    public function afterroute()
    {
    }

    //! Instantiate class
    public function __construct()
    {
        //on recuper la base du framework
        $this->f3 = Base::instance();
        $this->siteName = $this->siteName = isset($_SERVER['X-FRAMA-SITE']) || strstr($_SERVER['SERVER_NAME'], ".frama.site") ? $_SERVER['SERVER_NAME'] : "framasite";
    }

    /**********
     * Methode permettant de verifier si l'utilisateur courant est admin du site
     *
     * @return bool
     */
    public function isAdmin()
    {
        foreach ($this->f3->get('admins') as $admin) {
            if ($this->f3->get('SESSION.user') === $admin['user_id']) {
                return true;
            }
        }

        return false;
    }

    /**************************
     * Methode de récuperation de la structure du site de l'utilisateur a partir de sa bdd en flat file
     *
     * @return array
     */
    public function getSiteStructure()
    {
        //on recuper l'entrée dans la base
        $siteStructure = $this->db->read('siteStructure.json');
        //on commence par vérifier si il y a bien quelquechose en base
        if (empty($siteStructure)) {//si c'est vide on fait l'opération d'initialisation
            $this->initStructure();

            //on renvoie la valeur
            return $this->db->read('siteStructure.json');
        }

        //sinon, on renvoie direct la valeur
        return $siteStructure;
    }

    //opération d'initialisation lorsque la structure du site est vide
    public function initStructure()
    {
        //on vient utiliser la methode siteMap de l'objet fixtures qui renvoie une page type
        $siteStructure = (new Fixtures())->siteMap();
        //et on l'enregistre dans notre bdd
        $this->db->write('siteStructure.json', $siteStructure);
    }

    /**************************
     * Methode de récuperation des options du site de l'utilisateur a partir de sa bdd en flat file
     *
     * @return array
     */
    public function getSiteOptions()
    {
        //on recuper l'entrée dans la base
        $siteOptions = $this->db->read('siteOptions.json');
        //on commence par vérifier si il y a bien quelquechose en base
        if (empty($siteOptions)) {//si c'est vide on fait l'opération d'initialisation
            $this->initOptions();

            //on renvoie la valeur
            return $this->db->read('siteOptions.json');
        }

        //sinon, on renvoie direct la valeur
        return $siteOptions;
    }

    //opération d'initialisation lorsque la structure du site est vide
    public function initOptions()
    {
        //on vient utiliser la methode siteMap de l'objet fixtures qui renvoie une page type
        $siteOptions = (new Fixtures())->siteOptions();
        //et on l'enregistre dans notre bdd
        $this->db->write('siteOptions.json', $siteOptions);
    }

    /****************
     * methode permettant de recuperer la liste des modules possibles
     */
    public function getModuleList()
    {
        //on ititialise un tableau de résultat
        $modulesList = [];
        //on viens récuperer la liste des modules dispo directement dans le dossier
        // (comme ca pas besoin d'avoir a les déclarer, plus simple pour d'eventuels modders)
        $modulesFolderItems = scandir(__DIR__ . '/../views/modules/');
        //on initialise  un array de resultat
        $modules = [];
        //pourr tout ce qui a été récuperé
        foreach ($modulesFolderItems as $item) {
            //on ne selectionne que les dossier qui commence pas par "."
            if ($item[0] !== '.') {
                //et on les rentre dans notre liste de modules
                $modules[] = $item;
            }
        }
        //pour chaques modules,
        foreach ($modules as $module) {
            //on viens récuperer les info a partir du info.json
            $moduleInfo = json_decode(
                file_get_contents(__DIR__ . '/../views/modules/' . $module . '/info.json'),
                true
            );
            //et on les rentre dans notre tableau résultat
            $modulesList[] = $moduleInfo;
        }
        //puis on passe le tableau résultat en variable globale
        $this->f3->set('modulesList', $modulesList);

        return $modules;
    }

    //methode servant dans le middleware
    public function checkAdminOrReroute()
    {
        if (!$this->isAdmin()) {
            //on rajoute un petit message d'erreur qui sera affiché sur la page de login
            $this->f3->set(
                'SESSION.loginPageMessage',
                "vous devez vous authentifier pour accéder au options d'administration"
            );
            //puis on renvoie vers la page de login
            echo (new Template())->render('login.htm');
        }
    }

    public function getSafeGET($name)
    {
        return htmlentities($this->f3->get('GET')[$name]);
    }

    public function getSafePOST($name)
    {
        return htmlentities($this->f3->get('POST')[$name]);
    }
    //methode permettant de transmettre au script js de gestion de
    // la bibliotheque d'image le contenu de la table file au format json
    public function getMediasList()
    {
        $mediasList = $this->db->read('siteMedias.json');
        $this->f3->set('mediasList', json_encode($mediasList));
        $this->f3->set('mediasArray', $mediasList);

        return $mediasList;
    }

    public function getThemesList()
    {
        $themesList = json_decode(file_get_contents(__DIR__ . '/../config/themes.json'), true);
        $this->f3->set('themesList', json_encode($themesList));

        return $themesList;
    }

    public function getFontsList()
    {
        $fontsList = json_decode(file_get_contents(__DIR__ . '/../config/fonts.json'), true);
        $this->f3->set('fontsList', json_encode($fontsList));

        return $fontsList;
    }

    public static function imgAlt($imgUrl)
    {
        if ($imgUrl) {
            $mediaArray = Base::instance()->get('mediasArray');
            foreach ($mediaArray as $media) {
                if ($media['url'] === $imgUrl) {
                    return $media['label'];
                }
            }
        }

        return '';
    }

    public function checkFirstConnexion()
    {
        if (count($this->f3->get('admins')) === 0) {
            $this->f3->reroute('/signIn');
        }
    }
}
