company-scraper

1)  Alaska          :- "https://www.commerce.alaska.gov/cbp/main/search/entities" => Captcha Problem

2)  California      :- "https://businesssearch.sos.ca.gov/" => completed

3)  Florida         :- "http://search.sunbiz.org/Inquiry/CorporationSearch/ByName" => Done(need to check)

4)  Montana         :- "https://www.mtsosfilings.gov/mtsos-master/viewInstance/view.html" =>(only one field need to fetch) half remaining

5)  Nevada          :- "http://nvsos.gov/sosentitysearch/" => completed

6)  South Dakota    :- "https://sosenterprise.sd.gov/BusinessServices/Business/FilingSearch.aspx" => Done(need to check)

7)  Delaware        :- "https://icis.corp.delaware.gov/Ecorp/EntitySearch/NameSearch.aspx" => Captcha Probblem

8)  Wyoming         :- "https://wyobiz.wy.gov/business/" => completed

9)  Utah            :- "https://secure.utah.gov/bes/" => completed

10) Oregon          :- "http://egov.sos.state.or.us/br/pkg_web_name_srch_inq.login"  ==> site 
isn't working

11) SilverFlume     :- "https://www.nvsilverflume.gov/account/login" => remaining

12) Indiana         :- "https://bsd.sos.in.gov/publicbusinesssearch" => site is in maintenance

13) New Hampshire   :- "https://quickstart.sos.nh.gov/online/Account"  => maintenance

14) cdtfa           :- "https://services.cdtfa.ca.gov/ereg/index.boe" => remaining


=> cdtfa => dropdown selection 


=======
#Sample request
GET http://localhost:4040/api/scrape-nevada/get-data?keyword=ABC&host=http://nvsos.gov/
GET http://localhost:4040/api/scrape-nevada/get-detail?link=http://nvsos.gov/sosentitysearch/CorpDetails.aspx?lx8nvq=jdXjyHFI5Q7KdLbv95oA%252fg%253d%253d&nt7=0

#Nginx Config
`server {
	listen 80;
  server_name DOMAIN_NAME;
	client_max_body_size 20M;

	location / {
            proxy_pass http://127.0.0.1:9000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection $connection_upgrade;
            proxy_set_header X-Forwarded-For $remote_addr;

            if ($uri != "/") {
                expires 30d;
            }
         }

    }`

#Deployment
Install PM2
Clone repo or pull
Use node version v6.8.0
npm install
export NODE_ENV="production"
pm2 start --name company-scraper dist/index.js

pm2 logs company-scraper --lines 100 (check error logs)

* Note: ufw might block
>>>>>>> d959fe270d93180614b2e59e68b6a9faa81143d6


==========

# User Id and Password for SilveFlumes 

user: info@zyoninc.com
pass: GooglePlay#9

[![paypal](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](https://www.paypal.me/HarishMahajan)
