# robokodingweb

The website to program sumorobots graphically ^_^

## setup instructions

```bash
sudo apt-get install git arduino arduino-mk nodejs
wget https://github.com/robokoding/robokodingweb/releases/download/0.1/sumo.zip
sudo unzip sumo.zip -d /usr/share/
git clone https://github.com/robokoding/robokodingweb.git
cd robokodingweb && npm install && nodejs app.js
firefox localhost:3000/sumorobot
```

## change language

```bash
nano views/sumorobot.jade
```

change the **et** to **en** or **de**

![file](https://lh3.googleusercontent.com/Fbv_wKOmPOb4aQ4rE4B38DPfJ_XSuW_W3RIYm-XhDsJ6=w1092-h338-no)
