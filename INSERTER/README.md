# Realiza las siguientes acciones para insetar datos desde la Red internacional de humedad del suelo 

# Descarga los datos Accediendo a esta web y registrándote:
https://ismn.earth/en/

# Accede a esta web y en la parte inferior derecha permitirá descargar los datos si has iniciado sesión
https://ismn.earth/en/dataviewer/

# Una vez descargados descomprímelos y remombra la carpeta a "ISMN_archive_20230607"  debería quedar así 

- ISMN_archive_20230607
    - AACES
    - AMMA-CATCH
    - etc...

# Instala los servicios necesarios
npm install

# Una vez hecho abre una terminal en la carpeta inserter y ejecuta el sisguiente comando:
node run.js

# Empezará a insertar todos los dispositivos de esta red y se los asignará al usuario creado por defecto tfm@tfm.com