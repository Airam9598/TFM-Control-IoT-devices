# API

# Ejecuta los siguientes comandos para arrancar el proyecto

# Crea el archivo ".env" con el contenido de ".env-example"

# Instalar componentes
composer install

# Instala la clave
php artisan key:generate

# Crea las bases de datos
php artisan migrate

# Añade datos básicos y crea el usuario "tfm@tfm.com" con contraseña "123456"
php artisan db:seed

# Arrancar el servicio
php artisan serve
