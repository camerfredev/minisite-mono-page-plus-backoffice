<?php

/************************************
 * Class EditController
 * classe gérant les methodes d'édition de la page
 */
class EditController extends Controller
{
    // on fait en sorte que toutes les methodes ne soient accecssibles que si l'utilisateur est admin,
    //sinon, on le renvoie vers la page de login
    public function beforeroute()
    {
        parent::beforeroute();
        if (!$this->isAdmin()) {
            //on rajoute un petit message d'erreur qui sera affiché sur la page de login
            $this->f3->set(
                'SESSION.loginPageMessage',
                "vous devez vous authentifier pour accéder au options d'administration"
            );
            //puis on renvoie vers la page de login
            $this->f3->reroute('/login');
        } else {
            $tokenExpiration=3600; //1H
            $token=$this->f3->get('GET')['CSRFToken']?$this->f3->get('GET')['CSRFToken']:
                $this->f3->get('POST')['CSRFToken'];
            if ($token!==$this->f3->get('SESSION.CSRFToken')
                || time()>($this->f3->get('SESSION.CSRFTokenCreatedAt')+$tokenExpiration)
            ) {
                $this->f3->set(
                    'SESSION.error',
                    ["token : ".$token,$this->f3->get('SESSION.CSRFToken')]
                );
                $this->f3->reroute('/error');
            }
        }

        //hash; gestion du scroll sur la page
        $hash=$this->f3->get('GET')['hash']?$this->f3->get('GET')['hash']:
            $this->f3->get('POST')['hash'];
        if ($hash) {
            $this->f3->set('hash', '#'.$hash);
        } else {
            $this->f3->set('hash', '');
        }
    }


    //méthode d'insertion d'une section dans la page
    public function addSection()
    {
        //on commence par récuperer les valeurs contenues dans le formulaire
        $reference=$this->f3->get('POST.reference');
        $positionReference=$this->f3->get('POST.positionReference');
        $module=$this->f3->get('POST.module');
        //on recupere la structure du site
        $siteStructure=$this->getSiteStructure();
        //on cree un array pour acceuillir la nouvelle structure
        $newSiteStructure=[];
        //on vient créer un id pour cette section et lui donner aussi son module appelé
        $newSection=[
            'id'=>uniqid(),
            'module'=>$module,
            "fields"=>(new Fixtures())->getModuleInitValues($module),
        ];
        //pour chaque element de l'anciene structure
        foreach ($siteStructure as $i=>$section) {
            //si on est sur la section réference pour l'ajout
            if ($section['id']===$reference) {
                //on verifie ensuite si il faut placer la nouvelle section
                // avant ou apres la section de réference
                if ($positionReference==="after") {
                    //si c'est apres, on push d'abord la section de réference avant la nouvelle section
                    $newSiteStructure[]=$section;
                    $newSiteStructure[]=$newSection;
                } else {
                    //si c'est avant, on push d'abord la la nouvelle section avant section de réference
                    $newSiteStructure[]=$newSection;
                    $newSiteStructure[]=$section;
                }
            } else {//dans tout les autres cas on push la section au tableau de resultat
                $newSiteStructure[]=$section;
            }
        }
        //puis on sauvegarde en base la nouvelle structure
        $this->db->write('siteStructure.json', $newSiteStructure);
        //et on reroute vers la page d'admin
        $this->f3->reroute('/admin#'.$newSection['id']);
    }

    //méthode de supression d'une section dans la page
    public function deleteSection()
    {
        //in recupere l'id de la section a supprimer dans les query parameters
        $moduleId=$this->f3->get('GET.id');
        //on recupere la structure du site
        $siteStructure=$this->getSiteStructure();
        $hash="";
        //on viens supprimer la section avec l'id correspondant
        foreach ($siteStructure as $i=>$section) {
            if ($section['id']===$moduleId) {
                array_splice($siteStructure, $i, 1);
                $hash=$siteStructure[$i-1]['id'];
            }
        }
        //on sauvegarde en base
        $this->db->write('siteStructure.json', $siteStructure);
        //et on reroute vers la page d'admins
        $this->f3->reroute('/admin#'.$hash);
    }

    //méthode de déplacement vers le haut d'une section de la page
    public function moveUpSection()
    {
        //in recupere l'id de la section a supprimer dans les query parameters
        $moduleId=$this->f3->get('GET.id');
        //on recupere la structure du site
        $siteStructure=$this->getSiteStructure();
        //on boucle sur la structure
        foreach ($siteStructure as $i=>$section) {
            //lorqu'on trouve le bon module
            if ($section['id']===$moduleId) {
                if ($i>
                    0) {//on le déplace vers le haut(sauf si c'etait pas déja le premier)
                    $el=$siteStructure[$i-1];
                    $siteStructure[$i-1]=$siteStructure[$i];
                    $siteStructure[$i]=$el;
                }
            }
        }
        //on sauvegarde
        $this->db->write('siteStructure.json', $siteStructure);
        //et on reroute vers la page d'admin
        $this->f3->reroute('/admin'.$this->f3->get('hash'));
    }

    //méthode de supression d'une section dans la page
    public function moveDownSection()
    {
        //in recupere l'id de la section a supprimer dans les query parameters
        $moduleId=$this->f3->get('GET.id');
        //on recupere la structure du site
        $siteStructure=$this->getSiteStructure();
        //on boucle sur la structure jusqu'a trouver notre module
        foreach ($siteStructure as $i=>$section) {
            if ($section['id']===$moduleId) {
                if ($i<count($siteStructure)-
                    1) {//et on le descends dans le tableau si c'est pas le dernier element
                    $el=$siteStructure[$i+1];
                    $siteStructure[$i+1]=$siteStructure[$i];
                    $siteStructure[$i]=$el;
                }
            }
        }
        //on sauvegarde
        $this->db->write('siteStructure.json', $siteStructure);
        //et on reroute vers la page d'admin
        $this->f3->reroute('/admin'.$this->f3->get('hash'));
    }

    //methode d'ajout au menu d'une section pour une navigation rapide
    public function addToMenu()
    {
        //in recupere l'id de la section
        $moduleId=$this->f3->get('POST.id');
        //in recupere le label envoyé"
        $menuLabel=$this->f3->get('POST.label');
        //on recupere la structure du site
        $siteStructure=$this->getSiteStructure();
        //on boucle sur la structure jusqu'a trouver notre module
        foreach ($siteStructure as $i=>$section) {
            if ($section['id']===$moduleId) {
                $siteStructure[$i]['inMenuAs']=$menuLabel;
            }
        }
        //on sauvegarde
        $this->db->write('siteStructure.json', $siteStructure);
        //et on reroute vers la page d'admin
        $this->f3->reroute('/admin');
    }

    //methode de suppression d'un element du menu
    public function removeFromMenu()
    {
        //in recupere l'id de la section a supprimer dans les query parameters
        $moduleId=$this->f3->get('GET.id');
        //on recupere la structure du site
        $siteStructure=$this->getSiteStructure();
        //on boucle sur la structure jusqu'a trouver notre module
        foreach ($siteStructure as $i=>$section) {
            if ($section['id']===$moduleId) {
                $siteStructure[$i]['inMenuAs']='';
            }
        }
        //on sauvegarde
        $this->db->write('siteStructure.json', $siteStructure);
        //et on reroute vers la page d'admin
        $this->f3->reroute('/admin');
    }

    /******************************
     * Methode permettant la sauvegarde de tout les elements modifiables des modules
     */
    public function saveUglyForm()
    {
        // on recupere la structure du site
        $siteStructure = $this->getSiteStructure();
        // on récupere le tableau contenu dans _POST
        $postArray = $this->f3->get('POST');
        // voir la doc du purifier html ici http://htmlpurifier.org/
        $config = HTMLPurifier_Config::createDefault();
        $purifier = new HTMLPurifier($config);
        // pour chacunes des entrées
        foreach ($postArray as $key => $value) {
            // on récupere les infos contenues dans les clef des input name
            $splittedKey = explode("-", $key);
            $id = $splittedKey[1];
            $name = $splittedKey[2];
            //on corrige le défaut de medium éditeur (ou notre galere a le configurer en remplacant les balises h6 par des p
            $value = preg_replace('`<h6`', '<p', $value);
            $value = preg_replace('`</h6>`', '</p>', $value);
            //on vire les "\t" qui rendent le code dégueu
            $value = preg_replace('`\t`', '', $value);

            //on vire les balises vides  qui rendent le code dégueux
            if ($value === '<p><br></p>' || $value === '<br>') {
                $value = '';
            }
            //puis on boucle sur notre structure
            foreach ($siteStructure as $i => $section) {
                //si on est dans la bonne section
                if ($section['id'] === $id) {
                    //on cherche le bon name
                    foreach ($section['fields'] as $fieldName=>$fieldContent) {
                        if ($fieldName === $name) {
                            //puis on update cette entrée
                            $siteStructure[$i]['fields'][$fieldName]['value'] =
                                $purifier->purify($value);
                        }
                    }
                }
            }
        }
        //on sauvegarde notre tableau modifié par la méthode
        $this->db->write('siteStructure.json', $siteStructure);
        //et on reroute vers la page d'admin
        $this->f3->reroute('/admin'  . $this->f3->get('hash'));
    }

    /****************************************
     * Methode en AJAX d'ajout d'une image a la bibliotheque utilisateur
     */
    public function addMediaTolibrary()
    {

        //on viens récuoere les fichier envoyé par l'utilisateur
        $media=$this->f3->get('FILES')['media'];
        //gestion des erreurs d'upload
        if ($media['error']>0) {
            echo json_encode([
                'errors'=>$media,
                'errorMsg'=>"une erreur s'est produite lors de l'envoi du fichier",
            ]);
        } else {//gestion des erreurs d'extension
            $validsExtentions=['jpg','jpeg','gif','png','tif','bmp','svg'];
            $extension_upload=strtolower(substr(strrchr($media['name'], '.'), 1));
            if (!$extension_upload) {
                $extension_upload='png';
            }

            if (!in_array($extension_upload, $validsExtentions)
                && !in_array(strtoupper($extension_upload), $validsExtentions)
            ) {
                echo json_encode([
                    'name'=>$media['name'],
                    'ext'=>$extension_upload,
                    'errors'=>$media,
                    'errorMsg'=>"Extention de fichier invalide",
                ]);
            } else {
                //gestion de la taille limite des fichier
                $maxsize=5*1024*1024; //5MiB
                $media_size=$media['size'];
                list($width, $height, $type, $attr)=getimagesize($media['tmp_name']);
                if ($media_size>$maxsize) {
                    echo json_encode([
                        'errors'=>$media,
                        'errorMsg'=>"Votre fichier est trop volumineux, TAILLE LIMITÉE À 5 MEGA",
                    ]);
                } else {
                    //gestion de la sauvegarde dui fichier image dans le dossier media du site
                    $mediaName=uniqid();
                    if (!file_exists($this->f3->get('SitesFolder').$this->siteName.
                        '/medias')) {
                        mkdir($this->f3->get('SitesFolder').$this->siteName.'/medias');
                    }
                    $destination=$this->f3->get('SitesFolder').$this->siteName.'/medias/'.
                        $mediaName.".".$extension_upload;
                    if ($this->f3->get('isMediaPathModified')) {
                        $mediapath='../medias/';
                    } else {
                        $mediapath=
                            $this->f3->get('SitesFolder').$this->siteName.'/medias/';
                    }

                    $url=$mediapath.$mediaName.'.'.$extension_upload;
                    $result=move_uploaded_file($media['tmp_name'], $destination);
                    if (!$result) {
                        echo json_encode([
                            'errors'=>$media,
                            'errorMsg'=>"une erreur s'est produite lors de l'envoi du fichier",
                        ]);
                    } else {
                        //gestion de l'archivage des infos du fichier dans la table sitemedia
                        //on recupere la table
                        $siteMedias=$this->db->read('siteMedias.json');
                        //on formate la nouvelle entrée
                        $toPush=[
                            'id'=>$mediaName,
                            'type'=>'img',
                            'url'=>$url,
                            'label'=>'',
                            'size'=>($width && $height)?$width.'x'.$height:'',
                        ];
                        $alreadyExist=false;
                        foreach ($siteMedias as $searched) {
                            if ($searched['url']===$destination) {
                                echo json_encode([
                                    'errors'=>$media,
                                    'errorMsg'=>'La bibliothèque contient déjà un fichier du meme nom',
                                ]);
                                $alreadyExist=true;
                            }
                        }
                        //on l'insere au début du tableau
                        if (!$alreadyExist) {
                            array_unshift($siteMedias, $toPush);
                            //on sauvegarde la nouvelle table
                            $this->db->write('siteMedias.json', $siteMedias);
                            //et on renvoie les infos de la nouvelle entrée en json pour le script js
                            echo json_encode($toPush);
                        }
                    }
                }
            }
        }
    }

    /****************************************
     * Methode en AJAX d'ajout d'une image a la bibliotheque utilisateur
     */
    public function deleteMedia()
    {
        //on viens récuoere les fichier envoyé par l'utilisateur
        $id=$this->getSafeGET('id');
        //on récupere la table sitemedia
        $siteMedias=$this->db->read('siteMedias.json');
        //on formate la nouvelle entrée
        foreach ($siteMedias as $key=>$mediaInfo) {
            if ($mediaInfo['id']===$id) {
                if ($this->f3->get('isMediaPathModified')) {
                    unlink($this->f3->get('SitesFolder').$this->siteName.'/medias/'.
                        $mediaInfo['url']);
                } else {
                    unlink($mediaInfo['url']);
                }

                array_splice($siteMedias, $key, 1);
            }
        }
        //on sauvegarde la nouvelle table
        $this->db->write('siteMedias.json', $siteMedias);
        //et on renvoie les infos de la nouvelle entrée en json pour le script js
        echo json_encode(['deletedId'=>$id]);
    }

    /****************************************
     * Methode en AJAX d'edition des info associés a un média
     */
    public function editMediaInfo()
    {
        //on viens récuoere les fichier envoyé par l'utilisateur
        $id=$this->getSafePOST('id');
        $label=$this->getSafePOST('label');
        //on récupere la table sitemedia
        $siteMedias=$this->db->read('siteMedias.json');
        //on formate la nouvelle entrée
        foreach ($siteMedias as $key=>$mediaInfo) {
            if ($mediaInfo['id']===$id) {
                $siteMedias[$key]['label']=$label;
            }
        }
        //on sauvegarde la nouvelle table
        $this->db->write('siteMedias.json', $siteMedias);
        //et on renvoie les infos de la nouvelle entrée en json pour le script js
        echo json_encode(['id'=>$id,'label'=> htmlspecialchars($label)]);
    }

    /***************************
     * Methode d'edition du the de couleurs du site
     */
    public function editTheme()
    {
        //on viens récuperer les données en faisant un htmlentities dessus pour la sécu vu qu'elles seront ensuite affichées sans filtre
        $theme=[
            'name'=>$this->getSafePOST('name'),
            'menu_background'=>$this->getSafePOST('menu_background'),
            'main_background'=>$this->getSafePOST('main_background'),
            'main_color'=>$this->getSafePOST('main_color'),
            'contrasted_color'=>$this->getSafePOST('contrasted_color'),
            'second_background'=>$this->getSafePOST('second_background'),
            'second_color'=>$this->getSafePOST('second_color'),
        ];
        //puis on les sauvegarde dans les options de l'utilisateur
        $siteOptions=$this->db->read('siteOptions.json');
        $siteOptions['theme']=$theme;
        $this->db->write('siteOptions.json', $siteOptions);
        echo json_encode(['result'=>'success']);
    }

    /***************************
     * Methode d'edition des jeux de polices du site
     */
    public function editFont()
    {
        //on viens récuperer les données en faisant un htmlentities dessus pour la sécu vu qu'elles seront ensuite affichées sans filtre
        $chosenFont=$this->getSafePOST('name');
        $fontsList=$this->getFontsList();
        $fontToInclude=[];
        foreach ($fontsList as $font) {
            if ($font['name']===$chosenFont) {
                $fontToInclude=$font;
            }
        }
        //puis on les sauvegarde dans les options de l'utilisateur
        $siteOptions=$this->db->read('siteOptions.json');
        $siteOptions['font']=$fontToInclude;
        $this->db->write('siteOptions.json', $siteOptions);
        echo json_encode(['result'=>'success']);
    }

    /***************************
     * Methode d'edition des jeux de polices du site
     */
    public function editParams()
    {
        //on viens récuperer les données en faisant un htmlentities dessus pour la sécu vu qu'elles seront ensuite affichées sans filtre
        $siteParams=[];
        $siteParams['title']=$this->getSafePOST('title');
        $siteParams['titleSize']=$this->getSafePOST('titleSize');
        $siteParams['favIcon']=$this->getSafePOST('favIcon');
        $siteParams['siteLogo']=$this->getSafePOST('siteLogo');
        $siteParams['lang']=$this->getSafePOST('lang');
        $siteParams['description']=$this->getSafePOST('description');
        $siteParams['keywords']=$this->getSafePOST('keywords');
        $siteParams['isPublished']=$this->getSafePOST('isPublished')?'true':'';
        //$siteParams['framalink'] = $this->getSafePOST('framalink') ? $this->getSafePOST('framalink')  : '';
        //puis on les sauvegarde dans les options de l'utilisateur
        $siteOptions=$this->db->read('siteOptions.json');
        $siteOptions['params']=$siteParams;
        $this->db->write('siteOptions.json', $siteOptions);
        echo json_encode(['result'=>'success','params'=>$siteParams]);
    }
}
