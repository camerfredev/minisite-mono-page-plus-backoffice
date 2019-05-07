<?php


class Fixtures
{
    public function siteMap()
    {
        return [
            [
                'id'=>uniqid(),
                'module'=>'paralax',
                'fields'=>$this->getModuleInitValues('paralax'),
            ],
            [
                'id'=>uniqid(),
                'module'=>'three_goals',
                'fields'=>$this->getModuleInitValues('three_goals'),
            ],
            [
                'id'=>uniqid(),
                'module'=>'products',
                'fields'=>$this->getModuleInitValues('products'),
            ],
            [
                'id'=>uniqid(),
                'module'=>'caroutext',
                'fields'=>$this->getModuleInitValues('caroutext'),
            ],
            [
                'id'=>uniqid(),
                'module'=>'video',
                'fields'=>$this->getModuleInitValues('video'),
            ],
            [
                'id'=>uniqid(),
                'module'=>'button',
                'fields'=>$this->getModuleInitValues('button'),
            ],
            [
                'id'=>'footer',
                'fields'=>[
                    'rightText'=>[
                        'type'=>'text',
                        'value'=>'<p class="second-color">Ce pied de page peut être rempli à votre façon, sur une ou plusieurs lignes.</p>',
                    ],
                    'leftText'=>[
                        'type'=>'text',
                        'value'=>'<h5 class="second-color">NoemieCMS</h5><p class="second-color">Made with love by <b>Robin Banquo</b> <a href="https://www.patreon.com/robinbanquo">vos dons sont  bienvenus !</a></p>',
                    ],
                ],
            ],

        ];
    }

    public function siteParams()
    {
        $f3=Base::instance();

        return [
            'title'=>$f3->get('siteLabel'),
            'titleSize'=>'medium',
            'favIcon'=>'',
            'siteLogo'=>'',
            'lang'=>$f3->get('siteLang')?$f3->get('siteLang'):'fr_FR',
            'description'=>$f3->get('siteDescription'),
            'keywords'=>$f3->get('siteKeywords'),
            'isPublished'=>'true',
            //	'framalink' => ''
        ];
    }

    public function siteOptions()
    {
        $themesList=json_decode(file_get_contents(__DIR__.'/../config/themes.json'), true);
        $fontsList=json_decode(file_get_contents(__DIR__.'/../config/fonts.json'), true);

        return [
            'font'=>$fontsList[12],
            'theme'=>$themesList['Grav'],
            'params'=>$this->siteParams(),
        ];
    }

    public function getModuleInitValues($module)
    {
        $moduleInfo=json_decode(
            file_get_contents(__DIR__.'/../views/modules/'.$module.'/info.json'),
            true
        );

        return $moduleInfo['fields'];
    }
}
