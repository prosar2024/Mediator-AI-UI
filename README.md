# Install NodeJS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash - 
apt-get install -y nodejs


# yarn install

npm install -g pm2
npm install -g yarn

# yarn start
pm2 start yarn --name chat -- start

