# ZAP Scanning Report

ZAP by [Checkmarx](https://checkmarx.com/).


## Summary of Alerts

| Risk Level | Number of Alerts |
| --- | --- |
| High | 0 |
| Medium | 2 |
| Low | 1 |
| Informational | 9 |




## Insights

| Level | Reason | Site | Description | Statistic |
| --- | --- | --- | --- | --- |
| Info | Informational | https://proyecto-cesar.onrender.com | Percentage of responses with status code 2xx | 100 % |
| Info | Informational | https://proyecto-cesar.onrender.com | Percentage of endpoints with content type application/javascript | 25 % |
| Info | Informational | https://proyecto-cesar.onrender.com | Percentage of endpoints with content type text/css | 25 % |
| Info | Informational | https://proyecto-cesar.onrender.com | Percentage of endpoints with content type text/html | 50 % |
| Info | Informational | https://proyecto-cesar.onrender.com | Percentage of endpoints with method GET | 100 % |
| Info | Informational | https://proyecto-cesar.onrender.com | Count of total endpoints | 4    |
| Info | Informational | https://proyecto-cesar.onrender.com | Percentage of slow responses | 100 % |







## Alerts

| Name | Risk Level | Number of Instances |
| --- | --- | --- |
| CSP: Wildcard Directive | Medium | 3 |
| CSP: style-src unsafe-inline | Medium | 3 |
| Cross-Origin-Embedder-Policy Header Missing or Invalid | Low | 3 |
| Base64 Disclosure | Informational | 1 |
| Modern Web Application | Informational | 3 |
| Re-examine Cache-control Directives | Informational | 3 |
| Sec-Fetch-Dest Header is Missing | Informational | 2 |
| Sec-Fetch-Mode Header is Missing | Informational | 2 |
| Sec-Fetch-Site Header is Missing | Informational | 2 |
| Sec-Fetch-User Header is Missing | Informational | 2 |
| Storable and Cacheable Content | Informational | 2 |
| Storable but Non-Cacheable Content | Informational | 3 |




## Alert Detail



### [ CSP: Wildcard Directive ](https://www.zaproxy.org/docs/alerts/10055/)



##### Medium (High)

### Description

Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks. Including (but not limited to) Cross Site Scripting (XSS), and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

* URL: https://proyecto-cesar.onrender.com
  * Node Name: `https://proyecto-cesar.onrender.com`
  * Method: `GET`
  * Parameter: `content-security-policy`
  * Attack: ``
  * Evidence: `default-src 'self';base-uri 'self';font-src 'self' data:;form-action 'self';frame-ancestors 'none';img-src 'self' data: https:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' 'unsafe-inline';upgrade-insecure-requests;connect-src 'self'`
  * Other Info: `The following directives either allow wildcard sources (or ancestors), are not defined, or are overly broadly defined:
img-src`
* URL: https://proyecto-cesar.onrender.com/robots.txt
  * Node Name: `https://proyecto-cesar.onrender.com/robots.txt`
  * Method: `GET`
  * Parameter: `content-security-policy`
  * Attack: ``
  * Evidence: `default-src 'self';base-uri 'self';font-src 'self' data:;form-action 'self';frame-ancestors 'none';img-src 'self' data: https:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' 'unsafe-inline';upgrade-insecure-requests;connect-src 'self'`
  * Other Info: `The following directives either allow wildcard sources (or ancestors), are not defined, or are overly broadly defined:
img-src`
* URL: https://proyecto-cesar.onrender.com/sitemap.xml
  * Node Name: `https://proyecto-cesar.onrender.com/sitemap.xml`
  * Method: `GET`
  * Parameter: `content-security-policy`
  * Attack: ``
  * Evidence: `default-src 'self';base-uri 'self';font-src 'self' data:;form-action 'self';frame-ancestors 'none';img-src 'self' data: https:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' 'unsafe-inline';upgrade-insecure-requests;connect-src 'self'`
  * Other Info: `The following directives either allow wildcard sources (or ancestors), are not defined, or are overly broadly defined:
img-src`


Instances: 3

### Solution

Ensure that your web server, application server, load balancer, etc. is properly configured to set the Content-Security-Policy header.

### Reference


* [ https://www.w3.org/TR/CSP/ ](https://www.w3.org/TR/CSP/)
* [ https://caniuse.com/#search=content+security+policy ](https://caniuse.com/#search=content+security+policy)
* [ https://content-security-policy.com/ ](https://content-security-policy.com/)
* [ https://github.com/HtmlUnit/htmlunit-csp ](https://github.com/HtmlUnit/htmlunit-csp)
* [ https://web.dev/articles/csp#resource-options ](https://web.dev/articles/csp#resource-options)


#### CWE Id: [ 693 ](https://cwe.mitre.org/data/definitions/693.html)


#### WASC Id: 15

#### Source ID: 3

### [ CSP: style-src unsafe-inline ](https://www.zaproxy.org/docs/alerts/10055/)



##### Medium (High)

### Description

Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks. Including (but not limited to) Cross Site Scripting (XSS), and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

* URL: https://proyecto-cesar.onrender.com
  * Node Name: `https://proyecto-cesar.onrender.com`
  * Method: `GET`
  * Parameter: `content-security-policy`
  * Attack: ``
  * Evidence: `default-src 'self';base-uri 'self';font-src 'self' data:;form-action 'self';frame-ancestors 'none';img-src 'self' data: https:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' 'unsafe-inline';upgrade-insecure-requests;connect-src 'self'`
  * Other Info: `style-src includes unsafe-inline.`
* URL: https://proyecto-cesar.onrender.com/robots.txt
  * Node Name: `https://proyecto-cesar.onrender.com/robots.txt`
  * Method: `GET`
  * Parameter: `content-security-policy`
  * Attack: ``
  * Evidence: `default-src 'self';base-uri 'self';font-src 'self' data:;form-action 'self';frame-ancestors 'none';img-src 'self' data: https:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' 'unsafe-inline';upgrade-insecure-requests;connect-src 'self'`
  * Other Info: `style-src includes unsafe-inline.`
* URL: https://proyecto-cesar.onrender.com/sitemap.xml
  * Node Name: `https://proyecto-cesar.onrender.com/sitemap.xml`
  * Method: `GET`
  * Parameter: `content-security-policy`
  * Attack: ``
  * Evidence: `default-src 'self';base-uri 'self';font-src 'self' data:;form-action 'self';frame-ancestors 'none';img-src 'self' data: https:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' 'unsafe-inline';upgrade-insecure-requests;connect-src 'self'`
  * Other Info: `style-src includes unsafe-inline.`


Instances: 3

### Solution

Ensure that your web server, application server, load balancer, etc. is properly configured to set the Content-Security-Policy header.

### Reference


* [ https://www.w3.org/TR/CSP/ ](https://www.w3.org/TR/CSP/)
* [ https://caniuse.com/#search=content+security+policy ](https://caniuse.com/#search=content+security+policy)
* [ https://content-security-policy.com/ ](https://content-security-policy.com/)
* [ https://github.com/HtmlUnit/htmlunit-csp ](https://github.com/HtmlUnit/htmlunit-csp)
* [ https://web.dev/articles/csp#resource-options ](https://web.dev/articles/csp#resource-options)


#### CWE Id: [ 693 ](https://cwe.mitre.org/data/definitions/693.html)


#### WASC Id: 15

#### Source ID: 3

### [ Cross-Origin-Embedder-Policy Header Missing or Invalid ](https://www.zaproxy.org/docs/alerts/90004/)



##### Low (Medium)

### Description

Cross-Origin-Embedder-Policy header is a response header that prevents a document from loading any cross-origin resources that don't explicitly grant the document permission (using CORP or CORS).

* URL: https://proyecto-cesar.onrender.com
  * Node Name: `https://proyecto-cesar.onrender.com`
  * Method: `GET`
  * Parameter: `Cross-Origin-Embedder-Policy`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: https://proyecto-cesar.onrender.com/robots.txt
  * Node Name: `https://proyecto-cesar.onrender.com/robots.txt`
  * Method: `GET`
  * Parameter: `Cross-Origin-Embedder-Policy`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: https://proyecto-cesar.onrender.com/sitemap.xml
  * Node Name: `https://proyecto-cesar.onrender.com/sitemap.xml`
  * Method: `GET`
  * Parameter: `Cross-Origin-Embedder-Policy`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``


Instances: 3

### Solution

Ensure that the application/web server sets the Cross-Origin-Embedder-Policy header appropriately, and that it sets the Cross-Origin-Embedder-Policy header to 'require-corp' for documents.
If possible, ensure that the end user uses a standards-compliant and modern web browser that supports the Cross-Origin-Embedder-Policy header (https://caniuse.com/mdn-http_headers_cross-origin-embedder-policy).

### Reference


* [ https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cross-Origin-Embedder-Policy ](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cross-Origin-Embedder-Policy)


#### CWE Id: [ 693 ](https://cwe.mitre.org/data/definitions/693.html)


#### WASC Id: 14

#### Source ID: 3

### [ Base64 Disclosure ](https://www.zaproxy.org/docs/alerts/10094/)



##### Informational (Medium)

### Description

Base64 encoded data was disclosed by the application/web server. Note: in the interests of performance not all base64 strings in the response were analyzed individually, the entire response should be looked at by the analyst/security team/developer(s).

* URL: https://proyecto-cesar.onrender.com/assets/index-CcjP9xpw.css
  * Node Name: `https://proyecto-cesar.onrender.com/assets/index-CcjP9xpw.css`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `d09GMgABAAAAAAn4ABMAAAAAEwQAAAmOAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGjQbgnQcLj9IVkFSgQEGYD9TVEFUgQIAgQovahEICok0h0ULIAAwhzoBNgIkAzwEIAWHJgeBDgwHG6QQUdRKTmoBFD8K42bniObKrG3LZFcMWZzFmrjTFhQ6TVTqPJcInrfrvzq3b2PGn1wwMiNYGTy9ViREYARlL1zAGcPdPqBt3gNWrfKthv4xnM+b9caw+wmjgEUVRjHXhS6jgCK6zf5HiWQacJpGdAgdrbV6g/Rf1BfxRqZVQnrxRVWSJb6RLFnyu0elilmjeoSQCKnxsmwLaddUMjnksriSYuuPl06EAl7KfAiWQjCUETz0zNZ3EII94CDQtzkMfZ/9IkkY8tZRZTDky5ZVwBAM+GYpdd4ZVAWYImnLkiTg48l79gGx3D+VBtLeyg8u7bJAd4uo0pFuQBFysE9C95l0W4Fkiao6GfrDbu77lVU7wk9cV3uqOsXmQiMkhVKl1ugjzUAJBSIkkVWHijkpkVSyUFsgVBuJMA0N+ZnXtyUv5yMigGdfQRmwL1AAjQ3YXG6iIFNSUdPQo8+AISPGAltBMDQRAtyf4ZspLlZkpyOVoMZPvFGWzvk8p5SUC/NWPMj6T2/Yas2EdlON5GkfdkeFwVGjta825H89NIenlLWAPAp5h1KDtRhCaAQWMsFKtEvOKpIhgLHlXPARokkgEGEOAkqxJRQpKYq4ezahIiLHP6hZpqMbV0pUF2vdvEimLEQ/iIUYLgYWs0VXGVlLTOPdaPmFfCC/XrtzqVo1ez7vz6+Kd2+7o11ZJ+4MreLbB5BKVGxobAq4jZYalZ5aX2CKJiwUuc9GNJyi4M8bGyKcdjSRrG4JohdF8buJfmQefbYYREnMFsOoiNliFDVxmRgL0XUmUMLqzW0A4gCQAhWGYCQpFNukwXhIkPMsbRI19ewtw8Cp2Wj/Ro5cM2OTAbJAvZ/L4opBXb9+UHscYuOKM/W8isgwN26Exexjizmfnlp9dE3hOSqdZ/F5QqbckIlPb+oKfXxd6hftJ7Sm/uyPYpONza84CRlMNk/uhOrLpyf53982++zRkXNu3g3VF8qFbx1+7fbHZ9DrB3VXWNSmhnT2vrwS1+1Z+kHGBaZIhnnvuLBTNDeA340D1DWu5/jEa9pVfl6+Jij+yo3EELNixXCLjr173Q5eDP7Y7/L4iQFHbjpaJLFoP4cCsYP6sAPL7gMHNg53yYjqxqTDrYqLDl5DzW/eTLjYxCvucprjI3yl2ykKowKUC2Ox2FJLFo6Fa1HBWLC2jMCIIBEmklkYhmkpmBhTm/LCvJAH5oGcMKcgFEP1xUdho8ANPa6RFD99/PN60fjj9eXy2Eex4B5MpmRapXidzFk1p4uLk3+hn6jAP9ovJcXPPwk8o/0ltizbdbnTprvx4PSxT0VZ3Xc772aN7RflgbXRYwc3hLNO+k878nxGwfuVM8m8Gs7WEoVGWLHwSpx4vNSHBCMNqJ4m15Kp/TfHHVkQd++eY7PGN4W5byTs+6Ft8Ozvb/D60btv37de8ER0mS3P/0sLW84qGjEVkwztPzz06eGUWwKLwPb0D/WFd3vltl2aP276KpM0JNz6AfnAnZ5ADlF2zVyZ2OkxHSMxWPMnSZLbbDR3F1UjPVqp4d68da13F1YZujdWw7271iecO2l9+/4p47Oztjck355/75wFOI+VdGDqbNGs+ISgxg3iB2jb2r+b0CWsNLHIM4sdv8SDSFBP/Oromz6FNCWw2iMTxV0R8QLyBTkpe0j5+pSSJOOTB5Mck/gh3IopuNQnhKj02t3FL80gGbEh89SZcwTxcYt5cZT/nMnB3uXfPy8BSpVMBuRx+ZhACGzDBmwHsJRAjhotOnzuj2wDz3ug2wOUAY2NgZln9/TK/enG/oE4rO1wxvGUFMAxsZ0qNjRC7hl9d17e7imbgDt6uJXhUobDg7v3RX/yRCKxgMhfyiKcZfbpk0wmCcdQlIAOHeakXLvCNt++WfKiozNqSZxxJotn+c0a7DdPsx7DPYgKIDxwwYUZDg9aJbxocTjcwovr9WAsVV32mQoiiIOCHc60Oltst9qCQYuCqN1yHo0Kj60OgI2OqmiuBUWrNA0NDhYCDcdpmMrs1fZZ0xdTzMr1HdPtIHstYhqaPDDA5YxUDx7J4fJiisBSDI/L6G/bn34GNy8Q2g044ZTulAdFLb0tI6NNxfj3DzLjWiNGxje1pz7aXOcNV68lDPEd2SXl6VfBuwmHzdf1gxFy1HvA7pD8I2BnnmyGw852Cg5XbgIdEEGE5UCzen5jTlG6JCU5iajlxVcsXvbcS0SAcg1dcesWJLVK8+hYHOYQ+Pjy+EyVGXP0aPTFagrV9E03hCQvYx+g47KGq+1GsLj8uBIyihNw33YUe8PNC4BOJ3Lm1AglLV3nCuvUdIP+v15tVGbWIwgxLVpPkfpthCGpTKG+oA/DQfsKKvxhScqaN6FuElAUtTKv2UYgOmQegsN/n7njHUju8wM4VTcm+Q8xfX9SFwjTzdVqu95UOWSIGOabH8OGBEba//8Yxl3GcPdP/dMBOoSX/0z5SZmBoLbaPs+9asaMpb36yknKaw6FqWZa6A5vDa02mhkOba1q6KtLV208xrkwmW5C4VD6n2fvRjADy2qDYYnNy+H10Fq0LMbNzS863gkO7iQ8eC48/Ny5m59tOcEso3u7Qg3yrqDL6eKXwJAuWnhylfbWrRObe66rzX59+XDtzusnL66dI/86ArmtLlzED860Ef3bFPV78OX/zFTA11fcBn2Vntb7qiGBSgLBHyuv/uEaqqoTgSpOyjlzh86me1Vriv7i9rLPLvtghWmSnblRbAsBJL/4dScSQTBxOivHMO5QvBBY0iheJvfwWLxLOGzYKZyM4zVc2Cll46zEpeUV4MqGEWZj22SdOxhGAjgs9AEnfT+RoiMfcDb0GS5NncKVxju4Nt/mRk13O9Gz3FLct5oCD6wkwUNrCfHIUg6SMf8LwQGyVaBUqpLPW5BaMpRshEpl8nS1qw5dgnzlik8QBXmdy5UrIH74heTKZKMSilQso4hsRiGraQZRzxpNGqlEJMsXuAU7GlcR8mWSykUpVkWGyIf0a8v4qEQp5CtGsMiZa+4ESYQy+WilCiguHzxMXO54ogShooTV2bj2z1zL6DYSoImoQ8lFUWxMLBNQQgLkV2tHYgUoIbkuREz+fJHKxxWBcnvu3KQppFCxLkguB1NyVSp/TknRvNwYlCdbblWu3ze6owHdWluhE5tgQ6ej2SV65CijijoaRfSiH4Nqz1OpfEW+WeI/oU0ly60zkV9YzOQSYtZVEGYmrysTZAJkY4qZtIBD9/LYTIK7Nww3vMiYBwA=`
  * Other Info: `wOF2     	�       	�                       4�t.?HVAR�`?STAT� �
/j
�4�E  0�:6$< �&��Q�JNj?
�f��ʬm�dWY�Ś��:MT�<����:�ocƟ\02#X<�V$D`e/\���>�m�V���1�ϛ�ư�	��EF1ׅ.��"���G�dp�Ft��z��_��F�UBz�EU�%��,Y�G��Y�z����li�T29䲸�b돗N�^�|�B0�<���w�=� з9}��"I��Qe0�˖U��f)u�T�"i˒$���{���?����.�@w��ґn@r�OB��t[�d��:��n���U;�O\W{�:��B#$�R���#�@	"$�U��9)�T�P[ T�0��׷%/�#"�g_A�/P ��\n� SRQ�Уπ!#�[A04ܟ�).Vd�#���O�Q���<����V<��Oo�j̈́vS��ivG��Q���6�=4�����<
y�R��Bh2�J�K�*�!���\��I aJ�%))��{6�""�?�Y��WJTkݼH�,D?��.�EWYKL��h��| �^�s�Z5{>�ϯ�wo��]Y'�����JTlhl
�����Z_`�&,��F4����"�v4��n	�E�~d}�DI�è��b5q��u&P���m � ��`$)ۤ�xH��,m5��-����h�F�\3c��@����A]�~P{b�3����07n���c�9��Z}tM�9*�g�yB�ܐ�Oo�
}|]��'����b��ͯ8	L6O��˧'���6��ёsn��ʅo~���g��uWXԦ�t�����Y�A��H�y︰S47�ߍ�5����k�U~^�&(�ʍ��b�p���{�^������Gn:Z$�h?�������6wɈ�Ƥí��^C�o�L���+�r��#|��)
��c��RK��kQ�X����� &�Y�i)�S��¼�恜0� C��Ga��=��?}��z�������G��L�dZ�x��Y5��������?�/%��?	<��%�,�u�Ӧ�����OEY�w;�f��偵�c7��N�O;�|F���3ɼ���FX��J�x�ԇ#��&ג��7�Yw�c��7��o$���m���o��ѻo߷^�Dt�-��K[�*1��?<���[������w{�]�?n�*�4$������@Qv�\���1#1X�'I��l4wU#=Z��޼u�wV�7Vý��'�;i}��)㳳�7$ߞ�8��t`�lѬ�����h�ڿ��%�4��3��ăHPO���>�4%��#�]��9){H����$����!܊)��'������/� �!�ԙs�q�yq��������?/J�L�q��@l�l��@�-:|�l�{�������g��������8��p���1��*64B�}w^��)��;z���R�Ã��E�D"���_�"�e��L&	�P���\��6߾Y�3jI�q&�g���7O��=�
 <p��Z%�hq8���`,U]��
"���δ:[l�ڂA����r�
������h�E�4�i�����Y�S����� {-b�<0��T���b��R���o۟~7/�8��E-�-#�M���2�Z#F�7��>�\�W�%��%��W��	�����r�{���#`g�l���v
WnA��@�z~cNQ�$%9����W,^��KD�r]q�$�J��X�����L�s�h��j
��M7�$/c�㲆��F����2�p�v{���N'r��%-]�
��t���^mTf�#1-ZO��m�!�L����A�
*�aIʚ7�nP�2��F :d�����H��8U7&�1}R���j��T9d��ÆF����]�p�O��:���L�I�����>Ͻjƌ����I�k��fZ�o�6�m�j�KWm<ƹ0�nB�P��g�F0�j�a������Z�,���/:�	�$<x.<�ܹ��m9�,�{�B������.Zxr��֭�{���~}�p���'/��#�:��.\�δ���{����T��W�}�����!�J�+������*N�9s�Φ{Uk������.�`�i���Ql$��u'A0q:+�0�P�X�(^&��X�K8l�)���5\�)e�ĥ��ʆfc�d�;F8,�'}?��#p6�.M��;�6��FMw;ѳ�Rܷ��$�Ck	��R�1���U�T���[�Z2�l�Je�t��]�|�Oy�˕+ ~����d��T,��lF!�iQ�M�D$��;W�e��E)VE�ȇ�k���D)�+F�șk�I�2�h�
(.<L\�x�����ٸ��\��6���C�EQlL,PB�WkGb(!�.DL�|����r{�ܤ)�P�.H.SrU*NIѼ��'[nU��7���Z[��`C���%z�(��:E���j�S�|E�Y�?�M%˭3�_X��b�Uf&�+ddc����C���L��77�Ș `


Instances: 1

### Solution

Manually confirm that the Base64 data does not leak sensitive information, and that the data cannot be aggregated/used to exploit other vulnerabilities.

### Reference


* [ https://projects.webappsec.org/w/page/13246936/Information%20Leakage ](https://projects.webappsec.org/w/page/13246936/Information%20Leakage)


#### CWE Id: [ 319 ](https://cwe.mitre.org/data/definitions/319.html)


#### WASC Id: 13

#### Source ID: 3

### [ Modern Web Application ](https://www.zaproxy.org/docs/alerts/10109/)



##### Informational (Medium)

### Description

The application appears to be a modern web application. If you need to explore it automatically then the Client Spider may well be more effective than the standard one.

* URL: https://proyecto-cesar.onrender.com
  * Node Name: `https://proyecto-cesar.onrender.com`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `<script type="module" crossorigin src="/assets/index-KVqk9WHs.js"></script>`
  * Other Info: `No links have been found while there are scripts, which is an indication that this is a modern web application.`
* URL: https://proyecto-cesar.onrender.com/robots.txt
  * Node Name: `https://proyecto-cesar.onrender.com/robots.txt`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `<script type="module" crossorigin src="/assets/index-KVqk9WHs.js"></script>`
  * Other Info: `No links have been found while there are scripts, which is an indication that this is a modern web application.`
* URL: https://proyecto-cesar.onrender.com/sitemap.xml
  * Node Name: `https://proyecto-cesar.onrender.com/sitemap.xml`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `<script type="module" crossorigin src="/assets/index-KVqk9WHs.js"></script>`
  * Other Info: `No links have been found while there are scripts, which is an indication that this is a modern web application.`


Instances: 3

### Solution

This is an informational alert and so no changes are required.

### Reference




#### Source ID: 3

### [ Re-examine Cache-control Directives ](https://www.zaproxy.org/docs/alerts/10015/)



##### Informational (Low)

### Description

The cache-control header has not been set properly or is missing, allowing the browser and proxies to cache content. For static assets like css, js, or image files this might be intended, however, the resources should be reviewed to ensure that no sensitive content will be cached.

* URL: https://proyecto-cesar.onrender.com
  * Node Name: `https://proyecto-cesar.onrender.com`
  * Method: `GET`
  * Parameter: `cache-control`
  * Attack: ``
  * Evidence: `public, max-age=0`
  * Other Info: ``
* URL: https://proyecto-cesar.onrender.com/robots.txt
  * Node Name: `https://proyecto-cesar.onrender.com/robots.txt`
  * Method: `GET`
  * Parameter: `cache-control`
  * Attack: ``
  * Evidence: `public, max-age=0`
  * Other Info: ``
* URL: https://proyecto-cesar.onrender.com/sitemap.xml
  * Node Name: `https://proyecto-cesar.onrender.com/sitemap.xml`
  * Method: `GET`
  * Parameter: `cache-control`
  * Attack: ``
  * Evidence: `public, max-age=0`
  * Other Info: ``


Instances: 3

### Solution

For secure content, ensure the cache-control HTTP header is set with "no-cache, no-store, must-revalidate". If an asset should be cached consider setting the directives "public, max-age, immutable".

### Reference


* [ https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html#web-content-caching ](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html#web-content-caching)
* [ https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cache-Control ](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cache-Control)
* [ https://grayduck.mn/2021/09/13/cache-control-recommendations/ ](https://grayduck.mn/2021/09/13/cache-control-recommendations/)


#### CWE Id: [ 525 ](https://cwe.mitre.org/data/definitions/525.html)


#### WASC Id: 13

#### Source ID: 3

### [ Sec-Fetch-Dest Header is Missing ](https://www.zaproxy.org/docs/alerts/90005/)



##### Informational (High)

### Description

Specifies how and where the data would be used. For instance, if the value is audio, then the requested resource must be audio data and not any other type of resource.

* URL: https://proyecto-cesar.onrender.com
  * Node Name: `https://proyecto-cesar.onrender.com`
  * Method: `GET`
  * Parameter: `Sec-Fetch-Dest`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: https://proyecto-cesar.onrender.com/robots.txt
  * Node Name: `https://proyecto-cesar.onrender.com/robots.txt`
  * Method: `GET`
  * Parameter: `Sec-Fetch-Dest`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``


Instances: 2

### Solution

Ensure that Sec-Fetch-Dest header is included in request headers.

### Reference


* [ https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Sec-Fetch-Dest ](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Sec-Fetch-Dest)


#### CWE Id: [ 352 ](https://cwe.mitre.org/data/definitions/352.html)


#### WASC Id: 9

#### Source ID: 3

### [ Sec-Fetch-Mode Header is Missing ](https://www.zaproxy.org/docs/alerts/90005/)



##### Informational (High)

### Description

Allows to differentiate between requests for navigating between HTML pages and requests for loading resources like images, audio etc.

* URL: https://proyecto-cesar.onrender.com
  * Node Name: `https://proyecto-cesar.onrender.com`
  * Method: `GET`
  * Parameter: `Sec-Fetch-Mode`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: https://proyecto-cesar.onrender.com/robots.txt
  * Node Name: `https://proyecto-cesar.onrender.com/robots.txt`
  * Method: `GET`
  * Parameter: `Sec-Fetch-Mode`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``


Instances: 2

### Solution

Ensure that Sec-Fetch-Mode header is included in request headers.

### Reference


* [ https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Sec-Fetch-Mode ](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Sec-Fetch-Mode)


#### CWE Id: [ 352 ](https://cwe.mitre.org/data/definitions/352.html)


#### WASC Id: 9

#### Source ID: 3

### [ Sec-Fetch-Site Header is Missing ](https://www.zaproxy.org/docs/alerts/90005/)



##### Informational (High)

### Description

Specifies the relationship between request initiator's origin and target's origin.

* URL: https://proyecto-cesar.onrender.com
  * Node Name: `https://proyecto-cesar.onrender.com`
  * Method: `GET`
  * Parameter: `Sec-Fetch-Site`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: https://proyecto-cesar.onrender.com/robots.txt
  * Node Name: `https://proyecto-cesar.onrender.com/robots.txt`
  * Method: `GET`
  * Parameter: `Sec-Fetch-Site`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``


Instances: 2

### Solution

Ensure that Sec-Fetch-Site header is included in request headers.

### Reference


* [ https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Sec-Fetch-Site ](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Sec-Fetch-Site)


#### CWE Id: [ 352 ](https://cwe.mitre.org/data/definitions/352.html)


#### WASC Id: 9

#### Source ID: 3

### [ Sec-Fetch-User Header is Missing ](https://www.zaproxy.org/docs/alerts/90005/)



##### Informational (High)

### Description

Specifies if a navigation request was initiated by a user.

* URL: https://proyecto-cesar.onrender.com
  * Node Name: `https://proyecto-cesar.onrender.com`
  * Method: `GET`
  * Parameter: `Sec-Fetch-User`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: https://proyecto-cesar.onrender.com/robots.txt
  * Node Name: `https://proyecto-cesar.onrender.com/robots.txt`
  * Method: `GET`
  * Parameter: `Sec-Fetch-User`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``


Instances: 2

### Solution

Ensure that Sec-Fetch-User header is included in user initiated requests.

### Reference


* [ https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Sec-Fetch-User ](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Sec-Fetch-User)


#### CWE Id: [ 352 ](https://cwe.mitre.org/data/definitions/352.html)


#### WASC Id: 9

#### Source ID: 3

### [ Storable and Cacheable Content ](https://www.zaproxy.org/docs/alerts/10049/)



##### Informational (Medium)

### Description

The response contents are storable by caching components such as proxy servers, and may be retrieved directly from the cache, rather than from the origin server by the caching servers, in response to similar requests from other users. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where "shared" caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

* URL: https://proyecto-cesar.onrender.com/assets/index-CcjP9xpw.css
  * Node Name: `https://proyecto-cesar.onrender.com/assets/index-CcjP9xpw.css`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `max-age=3600`
  * Other Info: ``
* URL: https://proyecto-cesar.onrender.com/assets/index-KVqk9WHs.js
  * Node Name: `https://proyecto-cesar.onrender.com/assets/index-KVqk9WHs.js`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `max-age=3600`
  * Other Info: ``


Instances: 2

### Solution

Validate that the response does not contain sensitive, personal or user-specific information. If it does, consider the use of the following HTTP response headers, to limit, or prevent the content being stored and retrieved from the cache by another user:
Cache-Control: no-cache, no-store, must-revalidate, private
Pragma: no-cache
Expires: 0
This configuration directs both HTTP 1.0 and HTTP 1.1 compliant caching servers to not store the response, and to not retrieve the response (without validation) from the cache, in response to a similar request.

### Reference


* [ https://datatracker.ietf.org/doc/html/rfc7234 ](https://datatracker.ietf.org/doc/html/rfc7234)
* [ https://datatracker.ietf.org/doc/html/rfc7231 ](https://datatracker.ietf.org/doc/html/rfc7231)
* [ https://www.w3.org/Protocols/rfc2616/rfc2616-sec13.html ](https://www.w3.org/Protocols/rfc2616/rfc2616-sec13.html)


#### CWE Id: [ 524 ](https://cwe.mitre.org/data/definitions/524.html)


#### WASC Id: 13

#### Source ID: 3

### [ Storable but Non-Cacheable Content ](https://www.zaproxy.org/docs/alerts/10049/)



##### Informational (Medium)

### Description

The response contents are storable by caching components such as proxy servers, but will not be retrieved directly from the cache, without validating the request upstream, in response to similar requests from other users.

* URL: https://proyecto-cesar.onrender.com
  * Node Name: `https://proyecto-cesar.onrender.com`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `max-age=0`
  * Other Info: ``
* URL: https://proyecto-cesar.onrender.com/robots.txt
  * Node Name: `https://proyecto-cesar.onrender.com/robots.txt`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `max-age=0`
  * Other Info: ``
* URL: https://proyecto-cesar.onrender.com/sitemap.xml
  * Node Name: `https://proyecto-cesar.onrender.com/sitemap.xml`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `max-age=0`
  * Other Info: ``


Instances: 3

### Solution



### Reference


* [ https://datatracker.ietf.org/doc/html/rfc7234 ](https://datatracker.ietf.org/doc/html/rfc7234)
* [ https://datatracker.ietf.org/doc/html/rfc7231 ](https://datatracker.ietf.org/doc/html/rfc7231)
* [ https://www.w3.org/Protocols/rfc2616/rfc2616-sec13.html ](https://www.w3.org/Protocols/rfc2616/rfc2616-sec13.html)


#### CWE Id: [ 524 ](https://cwe.mitre.org/data/definitions/524.html)


#### WASC Id: 13

#### Source ID: 3


