rm master.zip -f; ssh-agent bash -c "ssh-add /root/.ssh/id_rsa_ght_admin;git archive --format=zip --remote=git@10.10.2.201:ghtk/ghtk-admin.git master --output=./master.zip"

unzip master.zip -d deploy

cd deploy

yarn install

yarn run build

rm -Rf /home/deployments/beta/current/app/webroot/adm/ 

mv dist /home/deployments/beta/current/app/webroot/adm

chown www-data.www-data -Rf /home/deployments/beta/current/app/webroot/adm