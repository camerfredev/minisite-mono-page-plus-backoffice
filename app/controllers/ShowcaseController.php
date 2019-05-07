<?php

//! Front-end processor
class ShowCaseController extends Controller
{
    public function beforeroute()
    {
        parent::beforeroute();
        if ($this->isAdmin()) {
            $CSRFToken = bin2hex(random_bytes(16));
            $CSRFTokenCreatetedAt = time();
            $this->f3->set('SESSION.CSRFToken', $CSRFToken);
            $this->f3->set('SESSION.CSRFTokenCreatedAt', $CSRFTokenCreatetedAt);
            $this->f3->set('CSRFToken', $CSRFToken);
        }
        $this->checkFirstConnexion();
    }


    //affichage du contenu de la page pour les visiteurs
    public function showVisitor()
    {
        //on commence par générer la page
        $this->generatePage();
        //puis on renvoie le template général
        $template = new Template;

        if ($this->f3->get('siteOptions')['params']['isPublished']) {
            //on ajoute au moteur de template notre fonction custom pour les alt image
            $template->filter('imgAlt', 'Controller::imgAlt');
            echo $template->render('template.htm');
        } else {
            echo $template->render('maintenance.htm');
        }
    }

    //affichage de la page d'administration du site
    public function showAdmin()
    {
        //on verifie que l'utilisateur est bien un admin
        if ($this->isAdmin()) {
            //on passe le isAdminPage a true, un petit drapeau bien pratique pour les manip du template
            $this->f3->set('isAdminPage', true);
            //on génere la page
            $this->generatePage();
            //on genere les données nécessaires à l'administration du site
            $this->generateAdminOnlyData();
            //puis on renvoie le template de base
            $template = new Template;
            //on ajoute au moteur de template notre fonction custom pour les alt image

            $template->filter('imgAlt', 'Controller::imgAlt');
            echo $template->render('template.htm');
        } else {//si il est pas admin, on renvoie vers la page de login avec un message d'erreur
            $this->f3->set(
                'SESSION.loginPageMessage',
                "vous devez vous authentifier pour accéder au options d'administration"
            );
            $this->f3->reroute('/login');
        }
    }

    //methode de génération de la page
    public function generatePage()
    {
        //on vient récuperer la structure du site telle qu'elle
        // 'est initialisé dans le constructeur du controller
        $siteStructure = $this->getSiteStructure();
        //on la passe dans les variables globales
        $this->f3->set('siteStructure', $siteStructure);

        $footer = $siteStructure[count($siteStructure) - 1];
        $this->getMediasList();
        $this->f3->set('footer', $footer);
        //on vient récuperer la structure du site telle qu'elle
        // 'est initialisé dans le constructeur du controller
        $siteOptions = $this->getSiteOptions();
        //on la passe dans les variables globales en version json et en version normale
        $this->f3->set('siteOptionsJson', json_encode($siteOptions));
        $this->f3->set('siteOptions', $siteOptions);

        //et on lance la methode d'import des differents fichier js des modules
        $this->importJs();
    }

    //methode d'import des differents fichier js des modules
    //l'idée est de ne pas importer plusieur fois le meme fichier js
    public function importJs()
    {
        //on recuper la structure su site
        $siteStructure = $this->f3->get('siteStructure');
        //on initialise un tableau de resultats
        $jsArray = [];
        //pour chacunes des section du site
        foreach ($siteStructure as $section) {
            //si le module n'est pas encore dans le tableau résultat
            if (!in_array($section['module'], $jsArray) && $section['id'] !== "footer") {
                //on l'y insere
                $jsArray[] = $section['module'];
            }
        }
        //puis on passe notre liste de nom de modules en variable globale
        $this->f3->set('jsSectionArray', $jsArray);
    }

    //methode de generation des infos complémentaires nécessaires a la page admin
    public function generateAdminOnlyData()
    {
        $this->getModuleList();

        $this->getThemesList();
        $this->getFontsList();
    }

    //
    public function contact()
    {
        $sectionId = $this->getSafePOST('sectionId');
        $mail = $this->getSafePOST('email');
        $objet=$this->getSafePOST('title');
        $message = $this->getSafePOST('content');
        $noRobot = $this->getSafePOST('no-robot');
        $nom = $this->getSafePOST('name');

        if ($noRobot === '4' || $noRobot === 'quatre') {
            $siteStructure = $this->getSiteStructure();
            $section = array_pop(array_filter($siteStructure, function ($elem) use ($sectionId) {
                return $elem["id"] === $sectionId;
            }));
            $destinataire = htmlentities($section['fields']['email']['value']);
            $subject = '=?UTF-8?B?' . base64_encode('Nouveau contact de '. $this->siteName . ' : ' .$objet).'?='; // Titre de l'email
            $contenu = '<html><head><title>' . 'Nouveau contact de ' . $this->siteName . '</title></head><body>';
            $contenu .= '<p>Bonjour, vous avez reçu un message à partir de votre site web ' . strtoupper($this->siteName) . '</p>';
            $contenu .= '<p><strong>Nom</strong>: ' . $nom . '</p>';
            $contenu .= '<p><strong>Email</strong>: ' . $mail . '</p>';
            $contenu .= '<p><strong>Message</strong>: ' . $message . '</p>';
            $contenu .= '</body></html>'; // Contenu du message de l'email (en HTML)

            $headers = 'MIME-Version: 1.0' . "\r\n";
            $headers .= 'Content-type: text/html; charset=UTF-8'."\r\n";
            $headers .= "Content-Transfer-Encoding: 8bit\r\n";

            ////ici on détermine l'expediteur et l'adresse de réponse
            $headers.= "From: Framasite <noreply@frama.site>\r\nReply-to: ". '"' . mb_encode_mimeheader(html_entity_decode($nom)). '" <'.$mail.">\r\nX-Mailer: PHP\r\n";
            if (mail($destinataire, $subject, $contenu, $headers)) {
                $this->f3->reroute('/');
            } else {
                $this->f3->reroute('error');
            }
        } else {
            $this->f3->reroute('error');
        }
    }
}
