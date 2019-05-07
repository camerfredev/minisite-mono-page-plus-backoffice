![logo](https://demo-pretty-noemie.frama.site/public/img/logo-final.svg)

# NoemieCms
![gif de démonstration de NoemieCms](https://framablog.org/wp-content/uploads/2018/02/pages-framasite-theme-light.gif)

CMS offrant à ses utilisateurs une solution ergonomique, simple et élégante pour construire en un rien de temps des sites vitrines responsives au design moderne.


La construction de votre site consistera à agencer à votre convenance des modules variés, d'éditer leurs contenus, et de personnaliser votre site en choisissant les polices de caractère, la mise en forme du texte, ainsi que les couleurs d'affichage


----------

## info du compte admin
Connectez-vous avec :

    login : stephane
    mdp : 123456

(Lorsque plusieurs personnes sont connectées en même temps au même site avec le même compte, NoemieCms peut estimer qu'il y a usurpation et renvoie des erreurs (`CSRF`)

## Grâce à ses modules variés, il conviendra parfaitement à de nombreuses utilisations :

 - Réalisation d'un CV en ligne
 - Portfolio d'artiste ou de créateur
 - Vitrine de votre association
 - Présentation de votre travail d'artisan
 - Page d'accueil d'un festival
 - Et tout ce que votre créativité en fera



----------



## Lancer le projet en local

**Pré-requis :**
- PHP (7.2 recommandé)
- `Composer` (sur votre système ou en installé dans votre dossier, [pour installer Composer, c'est ici](https://getcomposer.org/))

Téléchargez les fichiers en zip ou clonez le repository avec :

    git clone https://github.com/camerfredev/minisite-mono-page-plus-backoffice.git

Puis à l'intérieur du dossier, lancez la commande d'installation avec `Composer` :

    composer install

Si la commande n'est pas reconnue, essayez : `php composer.phar installer`


Lancez enfin le serveur local intégré à php (php7 voire un poil moins) avec :

    php -S localhost:8000


## Installer PrettyNoemie sur un serveur Nginx

Je pars du principe que vous utilisez Debian et la verison 7 de PHP-fpm

**Pré-requis :**
- PHP-fpm (7.2 recommandé)
- Nginx
- Composer (sur votre système ou en installé dans votre dossier, [pour installer Composer, c'est ici](https://getcomposer.org/))

**Déployer PrettyNoemie**

	cd /var/www/
	mkdir VOTRESITE

(ou directement dans /var/www/html)

	cd VOTRESITE

Téléchargez les fichiers en zip ou clonez le repository avec :

    git clone https://github.com/camerfredev/minisite-mono-page-plus-backoffice.git

Puis à l'intérieur du dossier, lancez la commande d'installation avec Composer :

    composer install

Si la commande n'est pas reconnue, essayez : `php composer.phar installer` ou `php composer.phar instal`

**Configurer PHP-fpm**

    cd /etc/php/7.0/fpm/pool.d
    nano www.conf

Trouvez la ligne commençant par "listen" puis remplacez-là par

    listen = 127.0.0.1:9000

ou un autre port, mais attention par la suite, il faudra le spécifier.

**Configurer Nginx pour PrettyNoemieCMS**

    cd /etc/nginx/sites-available
    rm default
    nano VOTRESITE

Voici une configuration fonctionnelle, remplacer XXX par votre nom de domaine :

    server {
            listen 80 default_server;
            listen [::]:80 default_server;

            root /var/www/VOTRESITE;

			# Add index.php to the list if you are using PHP
			index index.php index.html index.htm;

			server_name XXX;

			location / {
					# First attempt to serve request as file, then
					# as directory, then fall back to displaying a 404.

					try_files $uri $uri/ /index.php?$query_string;
			}

			# pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
			location ~ \.php$ {
					include snippets/fastcgi-php.conf;
					fastcgi_pass unix:/run/php/php7.0-fpm.sock;
					include fastcgi_params;
			}
	}

Si vous avez spécifié un port spécifique dans la configuration de PHP-fpm, alors remplacez `fastcgi_pass unix:/run/php/php7.0-fpm.sock;` par `fastcgi_pass 127.0.0.1:VOTREPORT`

Il faut activer votre site dans Nginx :

	ln -s /etc/nginx/sites-available/VOTRESITE /etc/nginx/sites-enabled/VOTRESITE

**Redémarrer PHP et Nginx**

    service php7.0-fpm restart
    service nginx restart



----------


## Licence

GNU AFFERO GENERAL PUBLIC LICENSE    Version 3, 19 November 2007
