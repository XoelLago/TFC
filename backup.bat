@echo off
set CONTAINER_NAME=galiza_db
set DB_NAME=galiza_db
set PASSWORD=root

echo Verificando si el contenedor %CONTAINER_NAME% esta encendido...

:: Intentamos hacer el backup en un archivo temporal primero
docker exec %CONTAINER_NAME% mysqldump -u root -p%PASSWORD% %DB_NAME% > temp_backup.sql 2> error.log

:: Si el archivo temporal tiene contenido (mas de 100 bytes), lo movemos a la carpeta real
for %%I in (temp_backup.sql) do if %%~zI GTR 100 (
    if not exist db-init mkdir db-init
    move /y temp_backup.sql db-init/galiza_db.sql
    echo [OK] Base de datos actualizada correctamente.
    del error.log
) else (
    echo [ERROR] No se pudo extraer la informacion. 
    echo Revisa el archivo error.log para mas detalles.
    if exist temp_backup.sql del temp_backup.sql
)

pause