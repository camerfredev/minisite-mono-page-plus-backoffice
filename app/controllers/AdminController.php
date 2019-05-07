<?php

/***************************
 * Class AdminController
 * Classe gérant l'authentification de l'utilisateur et l'affichage de la page de login
 */
class AdminController extends Controller
{
    public function beforeroute()
    {
        parent::beforeroute();
    }

    // affichage de la page login
    public function login()
    {
        $this->checkFirstConnexion();
        //si l'utilisateur est connecté comme admin
        if ($this->isAdmin()) {
            //on le renvoi direct sur la page admin
            $this->f3->reroute('/admin');
        } else {
            //sinon on rends le template de login
            $siteOptions=$this->getSiteOptions();
            $this->f3->set('siteOptionsJson', json_encode($siteOptions));
            $this->f3->set('siteOptions', $siteOptions);

            echo (new Template())->render('login.htm');
        }
    }

    // affichage de la page signIn
    public function signIn()
    {
        //si l'utilisateur est connecté comme admin
        if ($this->isAdmin()) {
            //on le renvoi direct sur la page admin
            $this->f3->reroute('/admin');
        } elseif (count($this->f3->get('admins'))!==0) {
            $this->f3->reroute('/login');
        } else {
            //sinon on rends le template de login
            $siteOptions=$this->getSiteOptions();
            $this->f3->set('siteOptionsJson', json_encode($siteOptions));
            $this->f3->set('siteOptions', $siteOptions);

            echo (new Template())->render('signIn.htm');
        }
    }

    public function postSignIn()
    {
        if (count($this->f3->get('admins'))!==0) {
            $this->f3->reroute('/login');
        }
        $username=$this->f3->get('POST.username');
        $password=$this->f3->get('POST.password');
        $repeatPassword=$this->f3->get('POST.repeatPassword');

        if ($password!==$repeatPassword) {
            $this->f3->set(
                'SESSION.signInPageMessage',
                "Les 2 mots de passe fournis ne sont pas identiques"
            );
            $this->f3->reroute('/signIn');
        }
        $siteConfig=json_decode(
            file_get_contents($this->f3->get('SitesFolder').$this->siteName.
                '/config.json'),
            true
        );
        $newAdmin=[
            "user_id"=>$username,
            "password"=>password_hash($password, PASSWORD_DEFAULT)
        ];
        array_push($siteConfig['admins'], $newAdmin);

        $contenu_json=json_encode($siteConfig);

        // Ouverture du fichier
        $fichier=fopen($this->f3->get('SitesFolder').$this->siteName.
            '/config.json', 'w+');
        // Ecriture dans le fichier
        fwrite($fichier, $contenu_json);
        // Fermeture du fichier
        fclose($fichier);
        //on entre le nom d'utilisateur en session
        $this->f3->set('SESSION.user', $username);
        //et on reroute vers la page d'admin
        $this->f3->reroute('/admin');
    }

    // methode de deconnexion
    public function logout()
    {
        $this->checkFirstConnexion();
        if ($this->isAdmin()) {
            //on vire l'user de la session
            $this->f3->set('SESSION.user', "");
        }
        $this->f3->reroute('/');
    }

    // affichage de la page login
    public function error()
    {
        //sinon on rends le template de login
        echo (new Template())->render('error.htm');
    }

    //méthode d'autentification
    public function authenticate()
    {
        $this->checkFirstConnexion();
        //on recupere le login/mot de passe passé en variables post
        $username=$this->f3->get('POST.username');
        $password=$this->f3->get('POST.password');
        $adminNotFound=true;
        //si le nom d'utilisateur coreespond a celui rentré en variable globale grace au fichier config( voir le constructeur de controller)

        foreach ($this->f3->get('admins') as $admin) {
            if ($username===$admin['user_id'] and
                //et si le passord est correct
                password_verify($password, $admin['password'])) {
                //on entre le nom d'utilisateur en session
                $this->f3->set('SESSION.user', $admin['user_id']);
                //et on reroute vers la page d'admin
                $this->f3->reroute('/admin');
                $adminNotFound=false;
            }
        }
        if ($adminNotFound) {
            //sinon, on transmet un message d'erreur et on renvoie vers la page de login
            $this->f3->set(
                'SESSION.loginPageMessage',
                "Nom d'utilisateur ou mot de passe invalide"
            );
            $this->f3->reroute('/login');
        }
    }
}
