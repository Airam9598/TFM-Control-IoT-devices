# Realiza las siguientes acciones para preparar el entorno


# Descarga e instala mongoDB Compass y mongoDB Community

https://www.mongodb.com/try/download/community

https://www.mongodb.com/try/download/compass


# Descargar e instala mamp

https://www.mamp.info/en/downloads/

# Modificar la versión de php a la 8.1 desde las preferencias de mamp

# Si utilizas el php del mamp para el composer, sigue las instrucciones, si no, modifica las rutas adaptandolas al la ruta del php que declaraste en las variables de entorno.

# Copia el archivo "php_mongodb.dll" que se encuentra en la carpeta "config" en la carpeta de instalación de mampp, dentro de "MAMP\bin\php\php8.1.0\ext"

# Duplica el archivo "php.ini-development" que está en la carpeta "MAMP\bin\php\php8.1.0" y renombralo a php.ini

# Abre el php.ini y añade las siguientes lineas
extension_dir = "ext"
extension=curl
extension=fileinfo
extension=openssl
extension=pdo_mysql
extension=mbstring
extension=mongodb


# Inicia el Mammp e inicia MongodbCompass


# Sigue las instrucciones de los Readme de la API y de la APP


