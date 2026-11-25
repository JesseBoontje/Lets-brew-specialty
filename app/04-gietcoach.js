/* De tekening uit docs/opzet-gietcoach-v60.html: schenkkan (docs/tekeningen/schenkkan-schoon.svg, gespiegeld, 0.41x, overgetrokken met overtrek.py --halen 7 --los 3.6 --kriskras 3; handvat links, tuit-haakje op TIP), V60 of Switch, glazen server. Alle ids beginnen met gc-. */
const GC_TEKENING="<svg id=\"gc-tek\" viewBox=\"-28 -16 328 370\" preserveAspectRatio=\"xMidYMid meet\" role=\"img\"\naria-label=\"kettle pours into the dripper, the dripper drips into the server\">\n<defs>\n<clipPath id=\"gc-cl-kegel\"><path d=\"M106 122 L238 122 L178 213 L166 213 Z\"/></clipPath>\n<clipPath id=\"gc-cl-bed\"><rect id=\"gc-bed-clip\" x=\"90\" y=\"172\" width=\"170\" height=\"60\"/></clipPath>\n<clipPath id=\"gc-cl-server\"><path d=\"M118 250 L226 250 Q230 290 234 318 Q236 338 214 344 Q172 349 130 344 Q108 338 110 318 Q114 290 118 250 Z\"/></clipPath>\n<mask id=\"gc-m-v60\" style=\"mask-type:alpha\"><image href=\"m-v60.png\" x=\"86.8\" y=\"108.9\" width=\"189.7\" height=\"233\"/></mask>\n</defs>\n<g clip-path=\"url(#gc-cl-server)\">\n<rect id=\"gc-sv-fill\" class=\"koffie\" x=\"100\" y=\"360\" width=\"150\" height=\"0\" opacity=\".9\"/>\n<rect id=\"gc-sv-crema\" class=\"crema\" x=\"100\" y=\"360\" width=\"150\" height=\"0\"/>\n<g id=\"gc-rimpel\" class=\"rimpel\"><path d=\"M-9 0 Q0 3 9 0\"/><path d=\"M-15 1 Q0 5 15 1\"/></g>\n</g>\n<path id=\"gc-drip\" class=\"drip\" d=\"\" opacity=\"0\"/>\n<g class=\"lijn glas\" id=\"gc-sv-lijn\">\n<path d=\"M112 247 Q172 241 233 248\"/>\n<path class=\"b\" d=\"M116 250 Q172 245 229 251\"/>\n<path d=\"M115 247 Q106 244 101 248 Q107 251 116 253\"/>\n<path d=\"M116 245 Q110 290 106 318 Q103 340 128 346\"/>\n<path class=\"b\" d=\"M120 250 Q114 292 111 318 Q109 336 130 342\"/>\n<path d=\"M229 245 Q235 290 238 318 Q241 340 216 346\"/>\n<path class=\"b\" d=\"M225 250 Q231 292 233 318 Q235 336 214 342\"/>\n<path d=\"M122 345 Q172 352 222 345\"/>\n<path class=\"b\" d=\"M130 348 Q172 351 214 348\"/>\n<path d=\"M228 254 Q272 250 274 286 Q275 320 236 330\"/>\n<path class=\"b\" d=\"M229 261 Q264 258 265 287 Q266 314 237 322\"/>\n<path class=\"z\" d=\"M50 353 Q172 357 296 352\"/>\n</g>\n<g id=\"gc-dr-groep\">\n<g clip-path=\"url(#gc-cl-kegel)\">\n<rect id=\"gc-bed-fill\" class=\"grond\" x=\"90\" y=\"172\" width=\"170\" height=\"60\" opacity=\".25\"/>\n<g clip-path=\"url(#gc-cl-bed)\"><g id=\"gc-arcering\" class=\"arcering\"></g></g>\n<rect id=\"gc-dr-fill\" class=\"koffie\" x=\"90\" y=\"213\" width=\"170\" height=\"0\" opacity=\".62\"/>\n<rect id=\"gc-dr-crema\" class=\"crema\" x=\"90\" y=\"213\" width=\"170\" height=\"0\"/>\n<path id=\"gc-dr-opp\" class=\"opp\" d=\"\"/>\n<path id=\"gc-bed-top\" class=\"bedlijn\" d=\"\"/>\n<g id=\"gc-bel\" class=\"bel\">\n<path d=\"M153 -4 Q153.5 -1 150.5 -.6 Q147.6 -1 148 -4 Q148.7 -6.6 151.6 -6.4 Q153.8 -5.6 153.4 -3\"/>\n<path d=\"M174 -6 Q174.6 -2.4 171 -2 Q167.6 -2.4 168 -5.8 Q168.8 -8.8 172.2 -8.6 Q174.8 -7.8 174.4 -5\"/>\n<path d=\"M193 -3.5 Q193.4 -1 190.8 -.7 Q188.4 -1 188.7 -3.5 Q189.3 -5.6 191.6 -5.4 Q193.4 -4.8 193.1 -2.8\"/>\n</g>\n</g>\n<g class=\"lijn\" id=\"gc-v60-lijn\">\n<path d=\"M97 120 Q170 102 247 118\"/>\n<path class=\"b\" d=\"M102 117 Q174 106 243 121\"/>\n<path d=\"M100 117 Q172 135 245 122\"/>\n<path class=\"b\" d=\"M105 121 Q169 131 240 117\"/>\n<path d=\"M95 121 Q98 126 107 126\"/>\n<path d=\"M249 119 Q246 125 237 126\"/>\n<path d=\"M102 121 Q132 168 168 218\"/>\n<path class=\"b\" d=\"M107 124 Q137 171 170 214\"/>\n<path d=\"M242 121 Q210 168 177 218\"/>\n<path class=\"b\" d=\"M237 124 Q206 170 175 214\"/>\n<path d=\"M162 212 Q172 218 183 212\"/>\n<path d=\"M166 213 Q164 226 166 239\"/>\n<path d=\"M178 213 Q180 226 178 239\"/>\n<path class=\"b\" d=\"M169 215 Q168 226 169 237\"/>\n<path d=\"M114 239 Q172 232 230 240\"/>\n<path class=\"b\" d=\"M119 241 Q172 235 225 242\"/>\n<path d=\"M116 238 Q112 242 119 245\"/>\n<path d=\"M228 239 Q232 243 225 246\"/>\n<path d=\"M117 245 Q172 240 227 246\"/>\n<path d=\"M230 128 Q268 124 266 152 Q263 182 214 180\"/>\n<path class=\"b\" d=\"M226 135 Q258 133 257 153 Q255 174 217 173\"/>\n<path class=\"z\" d=\"M121 128 Q138 160 160 204\"/>\n<path class=\"z\" d=\"M146 128 Q154 164 166 206\"/>\n<path class=\"z\" d=\"M199 128 Q190 164 178 206\"/>\n<path class=\"z\" d=\"M224 128 Q206 160 184 204\"/>\n</g>\n<rect id=\"gc-v60-tek\" class=\"inkt\" x=\"86\" y=\"108\" width=\"192\" height=\"236\" mask=\"url(#gc-m-v60)\"/>\n<g class=\"lijn\" id=\"gc-sw-lijn\" style=\"display:none\">\n<path d=\"M97 120 Q170 102 247 118\"/>\n<path class=\"b\" d=\"M102 117 Q174 106 243 121\"/>\n<path d=\"M100 117 Q172 135 245 122\"/>\n<path class=\"b\" d=\"M105 121 Q169 131 240 117\"/>\n<path d=\"M95 121 Q98 126 107 126\"/>\n<path d=\"M249 119 Q246 125 237 126\"/>\n<path d=\"M102 121 Q132 168 166 214\"/>\n<path class=\"b\" d=\"M107 124 Q137 171 168 211\"/>\n<path d=\"M242 121 Q210 168 179 214\"/>\n<path class=\"b\" d=\"M237 124 Q206 170 177 211\"/>\n<path class=\"z\" d=\"M126 134 Q143 160 158 186\"/>\n<path class=\"z\" d=\"M132 132 Q147 156 160 178\"/>\n<path d=\"M151 211 Q172 204 194 212\"/>\n<path class=\"b\" d=\"M155 214 Q172 208 190 214\"/>\n<path d=\"M158 210 Q155 223 157 236\"/>\n<path class=\"b\" d=\"M162 212 Q159 224 161 234\"/>\n<path d=\"M186 210 Q189 223 187 236\"/>\n<path class=\"b\" d=\"M182 212 Q185 224 183 234\"/>\n<path d=\"M124 236 Q172 228 220 237\"/>\n<path class=\"b\" d=\"M129 240 Q172 233 215 241\"/>\n<path d=\"M122 237 Q120 243 130 246\"/>\n<path d=\"M222 238 Q224 243 214 247\"/>\n<path d=\"M128 245 Q172 240 216 246\"/>\n<g id=\"gc-bal\"><path d=\"M176.6 219 Q178 224.6 173 226.4 Q167.6 226.8 166.6 221.6 Q166.4 216.4 171.6 215.8 Q176.6 216 177.6 220.6\"/></g>\n<g id=\"gc-klep-arm\">\n<path d=\"M187 224 Q201 222 214 219\"/>\n<path class=\"b\" d=\"M188 227 Q202 225 213 222\"/>\n<path d=\"M213 214 Q220 215 219 221 Q216 226 211 223 Q208 218 214 214\"/>\n</g>\n</g>\n<text id=\"gc-klep-tag\" class=\"tag\" x=\"222\" y=\"230\" style=\"display:none\">valve closed</text>\n<g id=\"gc-swirl\" class=\"zacht\" opacity=\"0\">\n<path d=\"M108 160 Q172 188 238 158\"/>\n<path d=\"M230 152 Q238 158 233 165\"/>\n</g>\n</g>\n<path id=\"gc-straal\" class=\"straal\" d=\"\"/>\n<path id=\"gc-straal-b\" class=\"straal b\" d=\"\"/>\n<g id=\"gc-damp\" class=\"damp\"><path d=\"M185 6 Q180 -1 185 -8 Q190 -14 186 -19\"/><path d=\"M193 8 Q189 2 193 -4 Q196 -9 194 -14\"/></g>\n<g id=\"gc-k-groep\">\n<g class=\"lijn kan\">\n<path d=\"M117.2 17 L113.8 15.9 L109.5 14.8 L100.9 13.3 L92.8 12.6 L87.3 12.5 L83.9 12.7 L64.4 14.4 L56.6 15.5 L54.6 16.1 L53.3 16.8 L50.5 20.4\" stroke-width=\"1.6\" opacity=\"0.97\"/>\n<path d=\"M116.8 16.9 L112.5 15.9 L107.6 15.2 L101.8 14.7 L94.4 14.4 L87.4 14.5 L81.4 14.8 L69.4 15.6 L62.5 16.3\" stroke-width=\"0.82\" opacity=\"0.62\"/>\n<path d=\"M101.7 14.1 L94.9 13.2 L88.6 12.6 L84.5 12.5 L79.4 12.7 L73.9 13.2 L67 14.1 L60.2 15.4 L56.3 16.5\" stroke-width=\"0.81\" opacity=\"0.76\"/>\n<path d=\"M108.4 12.5 L99 11.7 L89.2 11.7 L80.1 12.6 L69.6 14.3\" stroke-width=\"0.8\" opacity=\"0.67\"/>\n<path d=\"M109.9 14.2 L105.6 13.4 L101.7 13 L93.9 12.9 L86.6 13.5 L74.3 15 L59.5 15.7 L56.6 16.1 L54 16.8\" stroke-width=\"0.96\" opacity=\"0.73\"/>\n<path d=\"M99.6 14.5 L80.5 14.9 L71.9 14.9\" stroke-width=\"0.89\" opacity=\"0.62\"/>\n<path d=\"M106 14.3 L97.2 13.8 L87.6 13.7 L79 14.2 L67.7 15.6\" stroke-width=\"0.76\" opacity=\"0.69\"/>\n<path d=\"M119.8 17.4 L118.9 18 L116.8 18.7 L110.8 19.6 L87.3 22 L80 22.3 L74.9 22.3 L69.8 21.9 L65.9 21.5 L61.3 20.6 L57.8 19.6 L56.2 19 L54.8 18.1 L52 14.8\" stroke-width=\"1.6\" opacity=\"0.97\"/>\n<path d=\"M104 22.9 L97.6 24.3 L93.2 25 L88.9 25.5 L84.8 25.8 L79.1 25.7 L73.2 25.3 L60.8 24.2 L56.3 23.6\" stroke-width=\"0.85\" opacity=\"0.78\"/>\n<path d=\"M105.6 20.4 L86.9 22.3 L70.8 23.1\" stroke-width=\"0.81\" opacity=\"0.74\"/>\n<path d=\"M118.1 20 L106.6 21.2 L93.9 23 L87.5 23.6 L83.1 23.5 L78.9 23.1 L65.7 20.8\" stroke-width=\"0.88\" opacity=\"0.89\"/>\n<path d=\"M100.3 21.8 L94.2 21.6 L79.1 20 L64.2 20 L60.8 19.8\" stroke-width=\"0.96\" opacity=\"0.76\"/>\n<path d=\"M96.8 22.7 L88.3 22.5 L78.8 21.5 L74.1 20.7 L68.1 19.3 L63.5 18.1 L59.8 16.8\" stroke-width=\"0.88\" opacity=\"0.78\"/>\n<path d=\"M117.8 19.1 L114.8 19.9 L110 20.7 L105 21.2 L98.6 21.6 L86.4 21.8 L69.6 21.5 L61.2 21.1 L56.6 20.5 L54.4 19.8 L47.6 13.4\" stroke-width=\"0.96\" opacity=\"0.73\"/>\n<path d=\"M108.2 17.7 L103.7 17.3 L98.6 17.1 L81.2 17.2 L62.7 17 L55.7 17.3 L49.9 18.4\" stroke-width=\"1.6\" opacity=\"0.97\"/>\n<path d=\"M103.6 17.1 L98.1 17.4 L93.1 17.4 L79.6 16.3 L74.8 16.2 L69.9 16.5 L65 17.4\" stroke-width=\"0.92\" opacity=\"0.7\"/>\n<path d=\"M113 17.1 L106.4 16.2 L99.3 16.2 L93.6 16.7 L80.4 18.5 L70.9 19.3\" stroke-width=\"0.88\" opacity=\"0.71\"/>\n<path d=\"M122.4 20 L116.9 18.8 L106.7 16 L102.4 15.3 L98 15 L92.2 15.1 L81.4 16.3 L77.3 16.6 L59.6 16.4 L55.8 16.8 L50.9 17.8\" stroke-width=\"0.78\" opacity=\"0.67\"/>\n<path d=\"M109.4 18 L100.3 16.9 L89.4 16.2 L75.2 16 L63.2 16.3\" stroke-width=\"0.84\" opacity=\"0.76\"/>\n<path d=\"M115.1 20.2 L84.6 15.5 L78 14.7 L69.5 14.4 L65.4 14.6 L60.8 15.1\" stroke-width=\"0.91\" opacity=\"0.86\"/>\n<path d=\"M110.9 15.7 L101.3 16.2 L87 15.7 L81.3 15.8 L74.6 16.7 L67.1 18.8\" stroke-width=\"0.78\" opacity=\"0.75\"/>\n<path d=\"M120.7 13.9 L121.3 28.7 L121.6 39.7 L121 74.5 L121.2 90.9 L121 95.6 L120.3 100.9 L118.9 105.5 L118 107.4 L112.9 114.8\" stroke-width=\"1.6\" opacity=\"0.97\"/>\n<path d=\"M121.6 41.2 L120.4 55.6 L120 64.8 L120.2 75.1 L121.2 89.9 L121.2 93.8 L120.9 97.6\" stroke-width=\"0.96\" opacity=\"0.79\"/>\n<path d=\"M118.7 38.4 L120.2 50.7 L122.5 76.9 L123.9 89.1\" stroke-width=\"0.79\" opacity=\"0.66\"/>\n<path d=\"M118.8 26.4 L120.6 40 L121.2 47.5 L121.4 57.4 L121 70.6 L121 77.1 L121.3 83.2 L122.1 91.3 L122.3 96.2\" stroke-width=\"0.77\" opacity=\"0.61\"/>\n<path d=\"M119.9 42.5 L120.4 68.8 L121.7 90.4\" stroke-width=\"0.94\" opacity=\"0.68\"/>\n<path d=\"M122 14.9 L122.8 31.5 L122.6 53.2 L122.8 65.3 L123.4 75.8 L125.2 91.9 L125.3 97.5 L124.9 102 L124.5 104.2 L123.7 106.8 L122.3 109.7 L119.4 114.3\" stroke-width=\"0.96\" opacity=\"0.89\"/>\n<path d=\"M118.3 13.4 L118.8 30.1 L119.4 39.3 L122.2 67.6 L123 77.7 L123.5 88.3 L123.4 93.5 L123.1 97.2 L122.4 100.6 L121.9 102.8 L120.9 105.4 L119.6 107.9 L112.9 117.9\" stroke-width=\"0.71\" opacity=\"0.61\"/>\n<path d=\"M51.9 13.9 L51.6 28.9 L52.2 47.5 L52 56.5 L51.3 64.6 L48.6 83.8 L48.1 90.2 L48.4 96.9 L49.3 102.3\" stroke-width=\"1.6\" opacity=\"0.97\"/>\n<path d=\"M50.1 27.2 L49.5 39.9 L49.5 50.2 L49.9 59.5 L51.1 76.8 L51.4 87.4\" stroke-width=\"0.93\" opacity=\"0.6\"/>\n<path d=\"M54.4 45.6 L53.2 64.1 L51.6 81.6\" stroke-width=\"0.78\" opacity=\"0.6\"/>\n<path d=\"M52.3 46.2 L51.2 65.7 L51 76.9 L51.4 90.1 L51.9 94.4 L52.5 98.3\" stroke-width=\"0.72\" opacity=\"0.85\"/>\n<path d=\"M53.8 12.6 L52.9 28.3 L52.9 48.2 L52.5 57.4 L51.2 68 L47.9 87.5 L47.5 91.5 L47.4 95.1 L47.9 101.1 L48.9 105.3 L50.3 108.7 L53.8 114.7\" stroke-width=\"0.91\" opacity=\"0.82\"/>\n<path d=\"M59 10.6 L58.1 20.5 L57.6 37.3 L56.8 46.4 L55.4 56 L51.1 79 L50.2 86 L49.8 91.3 L49.9 97.7 L50.8 103.7 L51.9 106.9 L54.3 111.7\" stroke-width=\"0.91\" opacity=\"0.77\"/>\n<path d=\"M56.4 22.7 L53.4 40.9 L51.4 55 L48 84.1\" stroke-width=\"0.8\" opacity=\"0.74\"/>\n<path d=\"M121.7 105.8 L112.4 109.4 L105.2 111.7 L97.6 113.4 L90.2 114.3 L84.3 114.4 L76.7 113.8 L69.5 112.7 L59.5 110.6\" stroke-width=\"1.6\" opacity=\"0.97\"/>\n<path d=\"M103.5 109.3 L90 112.3 L81.4 113.6 L71.4 114.5 L66.6 114.5 L62.3 114.3\" stroke-width=\"0.87\" opacity=\"0.79\"/>\n<path d=\"M109.8 109.9 L105.2 111.3 L100.6 112 L83.7 113.2 L70.8 114.8 L64.4 115.2\" stroke-width=\"0.83\" opacity=\"0.74\"/>\n<path d=\"M100.8 109.9 L79.8 112.4 L72.2 113.1 L64.3 113.2 L59.9 112.7 L56.7 112.1\" stroke-width=\"0.72\" opacity=\"0.63\"/>\n<path d=\"M120.8 109 L112.6 111.3 L104.2 112.9 L94.8 113.9 L84.9 114.4 L74.2 113.9 L64.6 112.9 L60 112 L55.4 110.9 L47.8 108.3\" stroke-width=\"0.82\" opacity=\"0.69\"/>\n<path d=\"M116.9 109.1 L110.4 110.7 L101.9 111.6 L87.7 112 L71.8 111.8 L63.8 111.4 L58.2 110.8 L53.7 109.9 L45.2 107.6\" stroke-width=\"0.78\" opacity=\"0.71\"/>\n<path d=\"M125.9 105.7 L119.3 108 L113.9 109 L98.9 110.5 L87.3 111.9 L78.8 112.1 L72.7 111.6 L66.1 110.3 L60.9 108.7 L54.9 106.4 L48.2 104.3\" stroke-width=\"0.82\" opacity=\"0.69\"/>\n<path d=\"M114.3 96.6 L122.8 97.5 L125.1 97.5 L128.6 97.3 L132.8 96.5 L137.6 94.7 L141.7 92.6 L143.8 90.9 L145.8 88.5 L147.2 86.2 L148.6 83.3 L149.8 79.9 L150.8 76.7 L151.8 71.9 L153.5 61.6 L155.4 51.7 L159.1 36.6 L160.3 33.4 L162.2 29.8 L164 27.2 L166.1 25 L168.8 23 L172.2 21.4 L176.2 20.5 L179.9 20 L183.1 20 L186.4 20.3 L196.9 22.7\" stroke-width=\"1.6\" opacity=\"0.97\"/>\n<path d=\"M144 90.2 L146.6 87.5 L148.6 84.6 L150.6 80.4 L152.1 76 L153.5 70.6 L159.4 37.6 L160.9 32.8 L162.9 28.5 L164.8 25.9 L166.7 23.9 L169.1 22.1 L171.6 20.8 L175.3 19.7 L179 19.1 L183.1 18.9 L185.6 19.1\" stroke-width=\"0.75\" opacity=\"0.72\"/>\n<path d=\"M140 90.5 L142.2 88.9 L144.4 86.5 L146.6 83.3 L148.3 79.9 L149.9 75.8 L151.2 71.8 L155.8 52.8 L160.4 36.9 L162.5 32.3 L164.3 29.6 L166.7 26.9 L169 25.1\" stroke-width=\"0.84\" opacity=\"0.67\"/>\n<path d=\"M132.9 95.7 L136.6 94.7 L139.3 93.7 L142.3 92.3 L144 91 L146 89.1 L147.6 87.2 L149.5 84.2 L150.9 81.4 L152.7 76.8 L154.4 70.2 L155.8 60.3 L158 39.8 L158.8 35.3 L160.1 31.4 L161.8 28.1 L163.7 25.6 L165.9 23.6\" stroke-width=\"0.81\" opacity=\"0.76\"/>\n<path d=\"M150.7 77.3 L152.6 70.7 L155.5 55.6 L158.3 42.1 L159.6 36.8 L160.7 33.4 L161.8 31 L163.2 28.7 L164.8 26.5 L166.1 25.1 L167.8 23.7 L169.8 22.4 L171.5 21.7 L173.2 21.2\" stroke-width=\"0.81\" opacity=\"0.73\"/>\n<path d=\"M123.6 98 L127.7 97.8 L130.8 97.3 L134 96.5 L137.8 95 L141.3 93.1 L143.2 91.7 L145.1 89.8 L146.7 87.4 L148.3 84.4 L149.4 81.8 L151.6 74.7 L155.1 56.7 L159 39\" stroke-width=\"0.94\" opacity=\"0.89\"/>\n<path d=\"M138 93.8 L142 92.1 L143.6 91 L145.4 89.4 L147.2 87.3 L148.4 85.6 L151 80.8 L152.9 75.9 L154.1 71.7 L158.5 51.9 L161.9 38.4 L163.9 33.4 L165.2 31.2 L166.6 29.3\" stroke-width=\"0.92\" opacity=\"0.67\"/>\n<path d=\"M116.1 99.9 L124.8 100.8 L128.7 100.7 L133.5 100 L136.8 99.1 L140.6 97.7 L144.8 95.4 L146.7 94 L148.6 91.7 L150.1 89.4 L151.7 86.1 L153.2 82.2 L155.1 75.4 L158.9 56.8 L163.1 39.9 L164.6 36 L166.9 31.8 L168.6 29.7 L170.6 28 L173.1 26.5 L175.1 25.8 L179.4 25 L183.5 24.7 L195 25.2\" stroke-width=\"1.6\" opacity=\"0.97\"/>\n<path d=\"M138.5 94.7 L142.8 92.8 L144.5 91.8 L145.6 90.8 L147.1 89 L148.3 87.2 L150.4 82.6 L151.7 78.7 L153 73.6 L156.5 55.8 L159.5 42.3 L160.8 37.4 L162 34.1\" stroke-width=\"0.94\" opacity=\"0.74\"/>\n<path d=\"M150.3 85.6 L152.1 81.1 L153.5 76.7 L158.4 54.4 L160.4 46.5 L162.7 39.1\" stroke-width=\"0.83\" opacity=\"0.81\"/>\n<path d=\"M149.4 88 L150.8 85.7 L152.3 82.6 L154.8 75.4 L159.9 53.2 L162.5 42.7\" stroke-width=\"0.73\" opacity=\"0.79\"/>\n<path d=\"M153.5 82.7 L155.3 77.4 L156.3 73.6 L160.3 54.7 L163.9 39.4 L164.9 36.6 L166.1 33.9 L168.3 30.6\" stroke-width=\"0.75\" opacity=\"0.73\"/>\n<path d=\"M124.1 99.6 L128.2 99.9 L132.3 99.7 L135.5 99.1 L139.1 98.1 L142.6 96.6 L145.2 95 L147.5 92.9 L149.2 90.5 L150.6 88 L151.6 85.6 L153.3 80.1 L154.4 75 L155.8 65.3 L157.1 58.2 L158.8 50.9 L161.2 42.6\" stroke-width=\"0.97\" opacity=\"0.73\"/>\n<path d=\"M112.1 94.4 L125 97 L128.3 97.3 L132.1 97.2 L136.9 96.4 L141.1 95.2 L144.5 93.6 L147.3 91.3 L149.4 88.6 L150.8 86.3 L152.4 82.9 L153.7 79.3 L155.4 73 L158.1 59.4 L160 50.8 L162.5 41.9 L164.3 36.7 L166.7 32.2 L169.1 29.3 L171.8 26.9 L173.7 25.7 L175.3 25\" stroke-width=\"0.9\" opacity=\"0.66\"/>\n<path d=\"M187.3 20 L188.7 20.5 L189.5 21.4 L189.8 22.5 L189.5 23.3 L189 24 L188.1 24.4 L187 24.1 L186.2 23.2 L185.4 21.6\" stroke-width=\"1.6\" opacity=\"0.97\"/>\n<path d=\"M185.9 23 L186.3 23.2 L187.5 22.7 L188.3 22.6 L188.8 22.9 L188.8 23.5 L188 23.6 L186.9 23 L186.4 23 L185.8 23.3 L185.1 24\" stroke-width=\"0.77\" opacity=\"0.81\"/>\n<path d=\"M185.9 22 L187.3 22 L188.2 22.5 L188.5 23.4 L188.3 24.5 L187.4 25.4 L185.9 25.9 L184.8 25.9 L183.7 25.3\" stroke-width=\"0.96\" opacity=\"0.72\"/>\n<path d=\"M186.5 20.8 L187.4 21.3 L188.1 22.4 L188.3 23.4 L187.6 24.5 L186.8 24.8 L185.7 24.4 L184.8 23.3 L184.6 22.4\" stroke-width=\"0.8\" opacity=\"0.83\"/>\n<path d=\"M186.9 20.6 L186.9 21.1 L187.4 22.7 L187.2 23.5 L185.9 24 L184.9 24.2\" stroke-width=\"0.77\" opacity=\"0.63\"/>\n<path d=\"M186.8 21.2 L187.8 21.6 L188 22.1 L187.8 22.4 L187.1 21.4 L185.8 21.3\" stroke-width=\"0.78\" opacity=\"0.77\"/>\n<path d=\"M188.1 19.7 L190 20.8 L190.5 21.7 L190.4 22.7 L189.7 23.5 L188.8 23.6 L187.9 23 L187.3 21.8\" stroke-width=\"0.84\" opacity=\"0.67\"/>\n<path d=\"M64.6 25.4 L43.9 24.6 L30.7 24.3 L28.9 24.6 L28 25 L27.3 25.9 L26.8 27.2 L26.7 29.1 L28.9 52.8 L29.9 68.3 L30.4 70.3 L31.4 72 L33 73.7 L49.6 87 L55.3 91.3\" stroke-width=\"1.6\" opacity=\"0.97\"/>\n<path d=\"M25.4 26.7 L25.3 28.2 L26.3 48.5 L27.8 68.2 L28.8 71.1 L30.4 73.5 L32.5 75.2 L37.1 78.3\" stroke-width=\"0.73\" opacity=\"0.78\"/>\n<path d=\"M36.2 23 L30.5 22.6 L28.8 22.9 L28.1 23.2 L27.1 23.8 L26.2 24.9 L25.7 26.2 L25.4 27.9 L26.7 51.4 L28.1 68.8 L28.8 71 L30.1 73.1 L31.7 74.8 L34 76.3\" stroke-width=\"0.75\" opacity=\"0.69\"/>\n<path d=\"M56.9 24.5 L29.6 24 L27.9 24.5 L26.8 25.4 L26.2 26.7 L26 28.6 L30.1 68.2 L30.8 70.4 L31.7 71.8 L33.5 73.6 L59.6 91.7\" stroke-width=\"0.88\" opacity=\"0.73\"/>\n<path d=\"M30.7 24.7 L28.2 24.9 L27.3 25.3 L26.5 25.8 L26 26.5 L25.6 27.4 L25.3 29.8 L26.1 40.9 L27.2 49.7 L29.1 61 L30.7 69 L31.2 70.2\" stroke-width=\"0.82\" opacity=\"0.65\"/>\n<path d=\"M27.1 24.7 L26.5 26.1 L26.2 27.7 L25 49.8 L24.8 60 L25.1 67.9 L25.8 70.4 L27.1 72.6 L28.7 74.2 L32.2 76.7\" stroke-width=\"0.74\" opacity=\"0.68\"/>\n<path d=\"M39.1 23.9 L32.8 23.6 L30.5 23.8 L29.4 24.3 L28.7 24.9 L28.1 25.9 L27.8 27.2 L27.7 28.8 L29 42.6 L29.7 51.4 L30 59.2 L30 68.6 L30.7 70.9 L32.1 72.8\" stroke-width=\"0.72\" opacity=\"0.81\"/>\n<path d=\"M45.4 28.3 L32.9 28 L31.7 28.2 L31 28.9 L30.7 30.7 L31.6 40.5 L32 49.2 L31.8 68.2 L32.3 69.9 L32.7 70.8 L34.4 72.9 L45.3 82.1 L55.6 89.7\" stroke-width=\"1.6\" opacity=\"0.97\"/>\n<path d=\"M44.1 26.9 L35.5 26.6 L32.7 26.8 L31.7 27.3 L30.9 28.3 L30.6 29.5 L30.5 30.9 L33.1 52.2 L34.5 68.2 L35.2 69.7 L36.1 70.9 L44.7 77.8\" stroke-width=\"0.86\" opacity=\"0.77\"/>\n<path d=\"M59.3 27.3 L52.7 27.2 L32.8 25.8 L31.7 26 L30.9 26.5 L30.2 27.2 L29.7 28.2 L29.4 30.3 L30.2 44.5 L31.4 59.7 L31.9 65.7 L32.3 67.7 L33.4 70 L35 71.8 L43.2 77.2\" stroke-width=\"0.91\" opacity=\"0.83\"/>\n<path d=\"M45.8 30.6 L39.6 30.8 L31.9 30.8 L31.7 32.2 L32.2 48.7 L33 57 L34.1 64.7\" stroke-width=\"0.79\" opacity=\"0.82\"/>\n<path d=\"M38.2 28.9 L31.3 28.5 L30.6 28.7 L30.2 29.2 L29.9 30.9 L30 35.3 L30.8 46.6 L32.3 56.2 L34.4 66.8 L34.8 68 L35.7 69.4 L36.9 70.5 L43.5 74.8\" stroke-width=\"0.72\" opacity=\"0.71\"/>\n<path d=\"M34.3 27.7 L30.1 27.9 L29 28.3 L28.5 28.9 L28.3 29.4 L28.3 31.2 L32.2 52.6 L34.6 67.2 L35 68.2 L35.9 69.3 L41.4 72.8\" stroke-width=\"0.71\" opacity=\"0.65\"/>\n<path d=\"M30.7 28.3 L30.2 29.3 L30 31.1 L30.7 40.7 L31.7 49 L34.6 67.1 L34.9 68.1 L35.6 69.3 L36.5 70.2 L38.3 71.4\" stroke-width=\"0.97\" opacity=\"0.79\"/>\n<path d=\"M110.4 17.5 L110.8 30.9 L112.6 48.6 L113 54.8 L113 63 L112 79.9 L111.9 86 L112.3 94.5 L113.7 107.8 L114 118\" stroke-width=\"1.6\" opacity=\"0.97\"/>\n<path d=\"M110.2 49.4 L111 73.4 L110.9 83.9 L110.3 93.7\" stroke-width=\"0.76\" opacity=\"0.69\"/>\n<path d=\"M110 46.8 L111.9 78.5 L113.1 92.7\" stroke-width=\"0.86\" opacity=\"0.66\"/>\n<path d=\"M112.4 34 L110.9 59.2 L108.4 86.7\" stroke-width=\"0.86\" opacity=\"0.77\"/>\n<path d=\"M108.3 38.9 L109.1 48.6 L110.1 67.8 L110.7 76.3 L111.9 86.9 L113.9 99.4\" stroke-width=\"0.81\" opacity=\"0.76\"/>\n<path d=\"M110.5 45.3 L109.9 61 L108.1 87.4\" stroke-width=\"0.91\" opacity=\"0.74\"/>\n<path d=\"M110.5 45.8 L110.2 55.1 L108.4 72.3 L107.9 79.4 L107.9 87.6 L108.6 98\" stroke-width=\"0.78\" opacity=\"0.88\"/>\n<path d=\"M63.1 16.3 L62.6 29.2 L60.8 44.7 L60.2 51.6 L60.2 60.4 L61.1 76.1 L61.2 83.7 L60.8 90.8 L58.9 108 L58.6 115.8\" stroke-width=\"1.6\" opacity=\"0.97\"/>\n<path d=\"M65.8 25.3 L64 38.4 L62.7 50 L61.5 62.6 L60.1 80.2\" stroke-width=\"0.92\" opacity=\"0.72\"/>\n<path d=\"M62.1 22.8 L66.4 77.5 L67.2 92.3 L67.8 109.9\" stroke-width=\"0.72\" opacity=\"0.78\"/>\n<path d=\"M63.8 43.1 L62.8 53.5 L62.4 62.6 L62.5 70.2 L63 87.3 L63 95.2 L62.6 101.9 L61.5 115.5\" stroke-width=\"0.72\" opacity=\"0.83\"/>\n<path d=\"M63.6 35.5 L62.7 45 L62.4 53.4 L62.5 61.4 L63.5 79.1 L63.4 88.8\" stroke-width=\"0.84\" opacity=\"0.86\"/>\n<path d=\"M59.4 48.8 L63.3 88.3\" stroke-width=\"0.82\" opacity=\"0.76\"/>\n<path d=\"M60.1 39.4 L63.5 84\" stroke-width=\"0.78\" opacity=\"0.66\"/>\n<path d=\"M56 23.8 L52.1 23.2 L50.8 23.2 L49.9 23.9 L49.4 25.2 L49.5 28.1 L50.8 35.1 L51.1 38.1 L51.3 38.3 L53.8 38.6\" stroke-width=\"1.6\" opacity=\"0.97\"/>\n<path d=\"M53 22.4 L50.8 23.3 L50.4 23.8 L50.2 24.6 L50.2 25.1 L51 28.1 L51.2 30.4 L51.2 32.3 L50.5 37.8 L50.8 38.6 L51.4 39.1 L52.9 39.1 L54.7 38.9\" stroke-width=\"0.73\" opacity=\"0.78\"/>\n<path d=\"M50.3 24.7 L49.8 24.9 L49.7 25.2 L50.3 28.1 L50.2 30.2 L48.7 35.6 L48.5 37.6\" stroke-width=\"0.76\" opacity=\"0.7\"/>\n<path d=\"M54.4 26.5 L51.9 26 L51.8 25.7 L52.3 24.7 L51.1 27.7 L50.5 29.8 L50.4 31.3 L50.5 33.6 L51 36.6\" stroke-width=\"0.77\" opacity=\"0.89\"/>\n<path d=\"M51.3 24.5 L52.2 31.7 L52.3 33.6 L51.8 37.1 L51.6 37.3 L51.1 37 L53.9 37.9 L55.4 38.1\" stroke-width=\"0.76\" opacity=\"0.72\"/>\n<path d=\"M51.8 26.8 L52.5 29.4 L52.6 31.1 L52.4 33.2 L51.3 37.8 L53.1 37.6 L55.6 37\" stroke-width=\"0.86\" opacity=\"0.82\"/>\n<path d=\"M49.7 27.9 L49.6 31.5 L50.5 38.8 L50.8 39.2\" stroke-width=\"0.73\" opacity=\"0.73\"/>\n</g>\n</g>\n</svg>";
/* ---------------- gietcoach V60 en Switch (volledig scherm) ----------------
   Volgens docs/opzet-gietcoach-v60.html: bovenaan de tekening (ketel giet in
   de V60 of Switch, die druppelt in de glazen server), daaronder de grote
   teller met een liniaal van het recept, dan de strook vorige / nu / straks
   en onderaan grote knoppen. Het schema komt uit de pour coach (pc.steps),
   dus je eigen recept, dosis en verhouding lopen gewoon mee. Klaar? Dan landen
   de tijden in het formulier, net als bij de gewone klok.                  */
const GC_NAAM={bloom:'bloom',giet:'pour',swirl:'swirl',wacht:'steep',doorloop:'drawdown'};
const GC_TEMPO=5;     // g per seconde: de aangenomen gietsnelheid
const GC_VOORAF=3;    // zoveel tellen van tevoren zegt de stem de volgende stap
const GC_VINK='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.4 12.8 Q7.4 15.3 9.6 18.3 Q13.4 11 19.8 5.4"/></svg>';
const GC_STEM_LIJF='<path d="M3.6 9.3 Q3.4 12 3.7 14.8 M3.4 9.2 Q5.6 9 7.9 9.3 Q10.9 6.6 14.1 4.2 Q14.7 12 14.2 19.9 Q11 17.4 7.8 14.9 Q5.6 15.1 3.5 14.9"/>';
const GC_STEM_AAN='<svg viewBox="0 0 24 24" aria-hidden="true">'+GC_STEM_LIJF+'<path d="M17.3 9.1 Q19.3 12 17.4 15.1"/><path d="M19.6 6.4 Q23.2 12.1 19.7 17.8"/></svg>';
const GC_STEM_UIT='<svg viewBox="0 0 24 24" aria-hidden="true">'+GC_STEM_LIJF+'<path d="M17.2 9.4 Q19.3 11.8 21.6 14.6"/><path d="M21.4 9.3 Q19.2 11.9 17.3 14.7"/></svg>';
const GC_KRUIS='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6.2 Q12 12 18.2 17.8"/><path d="M18 6 Q12.2 12 5.8 18"/></svg>';

/* Past de grote coach bij deze methode? Alleen bij de V60 en de Switch: daar
   hoort de tekening bij. De rest houdt voorlopig de klok in de kaart.      */
function gcPast(mid){
  const k=brewerArtKey(mid);
  if(k==='switch')return true;
  if(k!=='v60')return false;
  const m=methodById(mid); const naam=((m&&m.name)||'').toLowerCase();
  return mid==='v60'||naam.includes('v60');
}

const gc=(()=>{
const $=id=>document.getElementById('gc-'+id);
const RM=window.matchMedia?window.matchMedia('(prefers-reduced-motion: reduce)'):{matches:false};

/* ---- de tekening: maten (zie de opzet) ---- */
const VCAP=300, VBED=24;
// twee tekeningen met eigen maten: de Switch (getekend in de svg) en de V60
// (Jesse's eigen tekening m-v60.png, ook het V60-icoon: x=173+(px-370)*0.233, y=138+(py-125)*0.233)
const GEO={
  switch:{CX:172,RIM:122,APEX:213,L:[106,0.659],R:[238,0.659],SV_BODEM:346,SV_TOP:256,SV_PER_G:0.17,OUT:240,
    kegel:'M106 122 L238 122 L178 213 L166 213 Z',
    server:'M118 250 L226 250 Q230 290 234 318 Q236 338 214 344 Q172 349 130 344 Q108 338 110 318 Q114 290 118 250 Z'},
  v60:{CX:173,RIM:138,APEX:223,L:[106,0.612],R:[238,0.553],SV_BODEM:330,SV_TOP:247,SV_PER_G:0.15,OUT:236,
    kegel:'M104 138 L240 138 L191 225 L158 225 Z',
    server:'M141 243 L206 243 L234 310 Q238 321 229 328 Q173 336 117 328 Q107 321 111 310 Z'}
};
let G=GEO.switch, CX=G.CX, RIM=G.RIM, APEX=G.APEX, HK=APEX-RIM, SV_BODEM=G.SV_BODEM, SV_PER_G=G.SV_PER_G;
function zetGeo(sw){
  G=sw?GEO.switch:GEO.v60; CX=G.CX; RIM=G.RIM; APEX=G.APEX; HK=APEX-RIM; SV_BODEM=G.SV_BODEM; SV_PER_G=G.SV_PER_G;
  const k=document.querySelector('#gc-cl-kegel path'), v=document.querySelector('#gc-cl-server path');
  if(k)k.setAttribute('d',G.kegel); if(v)v.setAttribute('d',G.server);
}
const KRUST=[0,-14], KGIET=[2,-40], KHOEK=32, PIV=[30,50], TIP=[188,23];
const xL=y=>G.L[0]+G.L[1]*(y-RIM);
const xR=y=>G.R[0]-G.R[1]*(y-RIM);
// een kegel: de hoogte groeit met de derdemachtswortel van het volume
const niveau=vol=>APEX-HK*Math.cbrt(Math.max(0,Math.min(1,vol/VCAP)));
const f1=n=>(Math.round(n*10)/10).toString();
const klem=(x,a,b)=>Math.max(a,Math.min(b,x));

/* ---- toestand ---- */
let R=null, S=[], starts=[], water=0, open=false, raf=0;
let fase='klaar';          // klaar | aftel | loopt | pauze | af
let pauzeVan='loopt';
let t=0, speed=1, stem=false, tFlow=0;
let gezegd={}, droogOp=null, eindT=null, terug=false;
let sim={V:0,S:0,vast:0,q:0};
const anim={hoek:0,r:0,kop:0,staart:0,klep:-18,bal:0};
let vorigeCur=-1, cache={};
try{stem=localStorage.getItem('scc_gc_stem')==='1';}catch(e){}

/* Wanneer hoort het bed droog te zijn? Staat het in de laatste stap
   ("droog rond 3:00 tot 3:30"), dan dat; anders een redelijke aanname. */
function droogVenster(stappen,sw){
  const l=stappen[stappen.length-1]||{t:0,d:''};
  const m=String(l.d||'').match(/(\d+):(\d\d)(?:\s*(?:tot|-|–)\s*(\d+):(\d\d))?/);
  if(m){
    const a=(+m[1])*60+(+m[2]), b=m[3]?(+m[3])*60+(+m[4]):a;
    if(a>l.t)return [a,Math.max(a,b)];
  }
  const v=l.t+(sw?45:60);
  return [v,v];
}
function bouw(){
  const r=recipeById(pc.rid)||{};
  const sw=isSwitch(pc.mid);
  const dose=parseFloat(document.getElementById('f-dose').value)||r.dose||15;
  const temp=document.getElementById('f-temp').value||r.temp||'';
  const maling=(document.getElementById('f-grind').value||r.maling||'').trim();
  water=pc.steps.length?(pc.steps[pc.steps.length-1].water||0):0;
  R={naam:r.naam||'pour coach',zetter:sw?'switch':'v60',dose,temp,maling,
     kV:sw?0.6:0.2,droog:droogVenster(pc.steps,sw)};
  let vorige=0, klepVorige=null;
  S=pc.steps.map((x,i,a)=>{
    const g=x.g?Math.round(+x.g):0;
    const st={t:+x.t||0,k:x.k||'giet',d:x.d||'',klep:x.klep||'',g,van:vorige};
    if(g){
      const gat=(a[i+1]?(+a[i+1].t||0):Infinity)-st.t;
      st.a=Math.max(0,g-vorige); st.dur=Math.max(4,Math.min(gat,st.a/GC_TEMPO)); vorige=Math.max(vorige,g);
    }
    st.wissel=(st.klep&&st.klep!==klepVorige)?st.klep:'';
    if(st.klep)klepVorige=st.klep;
    return st;
  });
  zetGeo(sw);
  $('v60-lijn').style.display='none';
  $('v60-tek').style.display=sw?'none':'';
  $('sv-lijn').style.display=sw?'':'none';
  $('sw-lijn').style.display=sw?'':'none';
  $('klep-tag').style.display=sw?'':'none';
  zet('naam',esc(R.naam));
  reset();
}
function reset(){
  fase='klaar'; t=0; tFlow=0; gezegd={}; droogOp=null; eindT=null; vorigeCur=-1; terug=false;
  starts=S.map(x=>x.t);
  sim={V:0,S:0,vast:0,q:0};
  anim.kop=0; anim.staart=0;
  BrewStem.stil();
  wakeUit(); linBouw();
}

/* ---- de klok ---- */
function cur(){
  if(t<0)return 0;
  let i=0; for(let j=0;j<S.length;j++)if(t>=starts[j])i=j;
  return i;
}
function gietNu(tt){
  for(let j=0;j<S.length;j++){const s=S[j];if(s.g&&tt>=starts[j]&&tt<starts[j]+s.dur)return j;}
  return -1;
}
function volgendeGiet(){
  for(let j=0;j<S.length;j++)if(S[j].g&&starts[j]>t)return j;
  return -1;
}
function gietEinde(){
  let e=0; S.forEach((s,j)=>{if(s.g&&isFinite(starts[j]))e=Math.max(e,starts[j]+s.dur);});
  return e;
}
function eindVerwacht(){const l=S.length-1;return starts[l]+(R.droog[1]-S[l].t);}
function klepOpen(tt){
  if(R.zetter!=='switch')return true;
  let k='dicht';
  for(let j=0;j<S.length;j++)if(S[j].klep&&tt>=starts[j])k=S[j].klep;
  return k==='open';
}
function fmt(s){s=Math.max(0,Math.floor(s+1e-6));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0');}
const fmtIn=s=>fmt(Math.ceil(Math.max(0,s)-1e-6));

/* ---- het model: water erin, koffie eruit ----
   Gemalen koffie houdt ongeveer 2 g water per gram vast; de rest staat in de
   zetter en loopt eruit, sneller naarmate er meer in staat. Bij de Switch
   alleen als de klep open is. Het is een model, geen weegschaal.          */
function instroom(tt){
  let r=0;
  for(let j=0;j<S.length;j++){const s=S[j];if(s.g&&tt>=starts[j]&&tt<starts[j]+s.dur)r+=s.a/s.dur;}
  return r;
}
function simuleer(van,tot){
  const vastMax=2*R.dose; let tt=van;
  while(tt<tot-1e-9){
    const dt=Math.min(0.05,tot-tt);
    const dw=instroom(tt)*dt;
    const vast=Math.min(dw*0.75,vastMax-sim.vast);
    sim.vast+=vast; sim.V+=dw-vast;
    let q=(klepOpen(tt)&&sim.V>0)?R.kV*Math.sqrt(sim.V):0;
    q=Math.min(q,sim.V/dt);
    sim.V-=q*dt; sim.S+=q*dt; sim.q=q;
    tt+=dt;
  }
}

/* ---- de knoppen ---- */
function start(){
  if(fase==='af')reset();
  fase='aftel'; t=-GC_VOORAF; gezegd={}; vorigeCur=-1;
  // de eerste zin meteen, in de tik zelf: anders mag een iPhone niet praten
  zeg(tekstVooraf(0)); gezegd.v0=true;
  if(stem)BrewStem.voorbereid(stemZinnen());   // de rest alvast ophalen (alleen met ElevenLabs)
  wakeAan();
}
function startKnop(){
  if(fase==='klaar')start();
  else if(fase==='af')sluit();
  else if(fase==='aftel'||fase==='loopt'){
    pauzeVan=fase; fase='pauze'; wakeUit();
    BrewStem.stil();
  }
  else if(fase==='pauze'){fase=pauzeVan; wakeAan();}
}
// "next step": de volgende stap begint nu, en alles daarna schuift mee
function volgende(){
  if(fase==='klaar'||fase==='af')return;
  if(t<0){t=0; if(fase==='aftel')fase='loopt'; else pauzeVan='loopt'; return;}
  const i=cur();
  if(i>=S.length-1){klaar();return;}
  schuif(i+1,t);
}
function schuif(j,op){
  starts[j]=op;
  for(let k=j+1;k<S.length;k++)starts[k]=starts[k-1]+(S[k].t-S[k-1].t);
  for(let m=j;m<S.length;m++){delete gezegd['v'+m];delete gezegd['n'+m];}
  gezegd['v'+j]='overgeslagen';
  linBouw();
}
function klaar(){
  const i=cur();
  for(let k=i+1;k<S.length;k++)starts[k]=Infinity;
  fase='af'; eindT=Math.round(Math.max(0,t));
  wakeUit(); zeg('Klaar.');
  linBouw();
  naarFormulier();
}
/* Wat de klok zag landt in het formulier, precies zoals bij de gewone klok:
   totale tijd, doorlooptijd vanaf de laatste giet, bloom-gewicht en -tijd. */
function naarFormulier(){
  if(terug)return; terug=true;
  pc.marks=S.map((s,j)=>(isFinite(starts[j])&&starts[j]<=eindT)?Math.round(starts[j]*10)/10:null);
  pc.total=Math.round(eindT);
  let laatste=null;
  S.forEach((s,j)=>{if(s.g&&pc.marks[j]!=null)laatste=pc.marks[j];});
  pc.draw=(laatste!=null&&eindT>laatste)?Math.max(0,Math.round(eindT-laatste)):null;
  pc.el=eindT; pc.run=false;
  pourFill();
  pcOpen.log=true; pcOpen.pour=false;
  const b=document.getElementById('pc-btn'); if(b)b.textContent='start again';
  pourSteps(); renderCards();
}

/* ---- hardop zeggen ---- */
function zeg(tekst){
  if(!stem||!tekst)return;
  toonZegt(tekst);
  BrewStem.zeg(tekst);      // ElevenLabs met eigen sleutel, anders de stem van de telefoon
}
let zegtT=0;
function toonZegt(tekst){
  const el=$('zegt'); el.querySelector('span').textContent='“'+tekst+'”';
  el.classList.add('op'); clearTimeout(zegtT);
  zegtT=setTimeout(()=>el.classList.remove('op'),3400);
}
// een receptregel als gesproken zin
function zin(d){
  const x=String(d).replace(/\s*—\s*/g,', ').replace(/×/g,' keer ')
    .replace(/(\d+):00 tot (\d+):30/,'$1 tot $2 en een halve minuut')
    .replace(/(\d+):(\d\d)/g,'$1 minuut $2').replace(/\s+/g,' ').trim();
  return x?(x.charAt(0).toUpperCase()+x.slice(1)+'.'):'';
}
function watZeg(s){
  return {swirl:'swirlen',wacht:'laten trekken',doorloop:(s.wissel==='open'?'klep open':'laten zakken')}[s.k]||(GC_NAAM[s.k]||s.k);
}
// alle zinnen die de stem in dit recept kan zeggen, in volgorde
function stemZinnen(){
  const l=[];
  for(let j=0;j<S.length;j++)l.push(tekstVooraf(j),tekstNu(j,true));
  for(let j=0;j<S.length;j++)l.push(tekstNu(j,false));
  return l.concat(['Het bed is droog. Tik op klaar.']);
}
function tekstVooraf(j){
  const s=S[j];
  const kl=(j===0&&s.wissel)?('Klep '+s.wissel+'. '):'';
  if(s.g)return kl+'Over drie tellen '+(s.k==='bloom'?'bloom, ':'')+'naar '+s.g+' gram.';
  return kl+'Over drie tellen: '+watZeg(s)+'.';
}
function tekstNu(j,vooraf){
  const s=S[j];
  if(speed!==1||vooraf==='kort'){
    if(s.g)return 'Naar '+s.g+' gram.';
    return {swirl:'Swirl.',wacht:'Laten trekken.',doorloop:(s.wissel==='open'?'Klep open.':'Laten zakken.')}[s.k]||'';
  }
  if(s.g)return vooraf===true?'Nu.':('Nu: naar '+s.g+' gram.');
  return (s.wissel?('Klep '+s.wissel+'. '):'')+zin(s.d);
}
function stemCheck(){
  if(fase!=='loopt')return;
  for(let j=1;j<S.length;j++){
    if(!gezegd['v'+j]&&t>=starts[j]-GC_VOORAF&&t<starts[j]){
      if(speed===1){gezegd['v'+j]=true;zeg(tekstVooraf(j));}else gezegd['v'+j]='kort';
    }
  }
  for(let k=0;k<S.length;k++){
    if(!gezegd['n'+k]&&t>=starts[k]){gezegd['n'+k]=true;zeg(tekstNu(k,gezegd['v'+k]));}
  }
  if(droogOp!=null&&!gezegd.droog){gezegd.droog=true;zeg('Het bed is droog. Tik op klaar.');}
}
function stemKnop(){
  stem=!stem;
  try{localStorage.setItem('scc_gc_stem',stem?'1':'0');}catch(e){}
  if(stem){
    if(!BrewStem.kan())meld('no voice in this browser — the screen still shows every step');
    else zeg('Stem aan.');
  }else{
    BrewStem.stil();
    $('zegt').classList.remove('op');
  }
}
let meldT=0;
function meld(m){
  const el=$('toast'); el.textContent=m; el.classList.add('op');
  clearTimeout(meldT); meldT=setTimeout(()=>el.classList.remove('op'),2800);
}

/* ---- het scherm blijft aan zolang je zet ---- */
let wake=null, wakeStatus='';
function wakeAan(){
  if(!('wakeLock' in navigator)){wakeStatus='nee';return;}
  try{
    navigator.wakeLock.request('screen').then(w=>{
      if(!(fase==='loopt'||fase==='aftel')){try{w.release();}catch(e){}return;}
      wake=w; wakeStatus='aan';
      w.addEventListener('release',()=>{wake=null;if(fase==='loopt'||fase==='aftel')wakeStatus='los';});
    }).catch(()=>{wakeStatus='nee';});
  }catch(e){wakeStatus='nee';}
}
function wakeUit(){
  try{if(wake)wake.release();}catch(e){}
  wake=null; wakeStatus='';
}
document.addEventListener('visibilitychange',()=>{
  if(open&&document.visibilityState==='visible'&&(fase==='loopt'||fase==='aftel')&&!wake)wakeAan();
});

/* ---- de liniaal onder de teller ---- */
let linEls=[];
function linBouw(){
  const lin=$('lin');
  lin.querySelectorAll('.lin-giet,.lin-tik').forEach(e=>e.remove());
  linEls=[];
  S.forEach((s,j)=>{
    if(!isFinite(starts[j]))return;
    if(s.g){const e=document.createElement('i');e.className='lin-giet';lin.insertBefore(e,$('lin-nu'));linEls.push({e,j,giet:true});}
    if(j>0){const b=document.createElement('b');b.className='lin-tik';lin.insertBefore(b,$('lin-nu'));linEls.push({e:b,j,giet:false});}
  });
}
function linSpan(){
  if(fase==='af')return Math.max(eindT,1);
  return Math.max(eindVerwacht(),Math.max(0,t)+3);
}
function linUpdate(){
  const span=linSpan(), nu=fase==='af'?eindT:Math.max(0,t);
  linEls.forEach(o=>{
    const s=S[o.j], x=starts[o.j]/span*100;
    o.e.style.left=x+'%';
    if(o.giet){o.e.style.width=Math.max(1.2,s.dur/span*100)+'%';o.e.classList.toggle('gedaan',nu>=starts[o.j]+s.dur);}
    else o.e.classList.toggle('gedaan',nu>=starts[o.j]);
  });
  const p=Math.min(100,nu/span*100);
  $('lin-nu').style.left=p+'%'; $('lin-ged').style.width=p+'%';
  zet('lin-eind',fase==='af'?fmt(eindT):'~'+fmt(eindVerwacht()));
}

/* ---- tekenen, elke frame ---- */
function rot(p,c,deg){
  const a=deg*Math.PI/180, dx=p[0]-c[0], dy=p[1]-c[1];
  return [c[0]+dx*Math.cos(a)-dy*Math.sin(a), c[1]+dx*Math.sin(a)+dy*Math.cos(a)];
}
// het stuk [a,b] van een kubische bezier: zo groeit de straal uit de tuit
// en laat hij aan het eind van boven los
function deel(P,a,b){
  const lerp=(p,q,u)=>[p[0]+(q[0]-p[0])*u,p[1]+(q[1]-p[1])*u];
  function split(Q,u){
    const a1=lerp(Q[0],Q[1],u),b1=lerp(Q[1],Q[2],u),c1=lerp(Q[2],Q[3],u);
    const a2=lerp(a1,b1,u),b2=lerp(b1,c1,u),m=lerp(a2,b2,u);
    return [[Q[0],a1,a2,m],[m,b2,c1,Q[3]]];
  }
  let Q=P;
  if(b<1)Q=split(Q,b)[0];
  if(a>0&&b>0)Q=split(Q,Math.min(.999,a/b))[1];
  return Q;
}
function pad(Q){
  const p=x=>f1(x[0])+' '+f1(x[1]);
  return 'M'+p(Q[0])+' C'+p(Q[1])+' '+p(Q[2])+' '+p(Q[3]);
}
function teken(dtR){
  const rm=RM.matches;
  const bezig=(fase==='loopt'||fase==='pauze'||fase==='aftel');
  const tt=Math.max(0,t), i=cur();
  const j=(bezig&&t>=0)?gietNu(tt):-1, giet=j>=0;

  // de ketel kantelt alleen tijdens een giet, en vlak ervoor een beetje
  let doel=0;
  if(giet)doel=KHOEK;
  else if(bezig){const k=volgendeGiet();if(k>=0){const over=starts[k]-t;if(over>=0&&over<1.4)doel=14*(1-over/1.4);}}
  anim.hoek=rm?doel:anim.hoek+(doel-anim.hoek)*Math.min(1,dtR*7);
  const rDoel=giet?(S[j].k==='bloom'?6:10):0;
  anim.r=rm?0:anim.r+(rDoel-anim.r)*Math.min(1,dtR*3);
  const dx=anim.r*Math.sin(tFlow*2*Math.PI/2.6);
  const ku=klem(anim.hoek/KHOEK,0,1);
  const kx=KRUST[0]+(KGIET[0]-KRUST[0])*ku+dx*0.45, ky=KRUST[1]+(KGIET[1]-KRUST[1])*ku;
  $('k-groep').setAttribute('transform','translate('+f1(kx)+' '+f1(ky)+') rotate('+f1(anim.hoek)+' '+PIV[0]+' '+PIV[1]+')');
  const tip=rot(TIP,PIV,anim.hoek); tip[0]+=kx; tip[1]+=ky;
  $('damp').classList.toggle('uit',anim.hoek>4);

  // swirl: de zetter draait kleine rondjes
  let sx=0, sy=0;
  const swirl=bezig&&t>=0&&S[i].k==='swirl'&&(t-starts[i])<5;
  if(swirl&&!rm){sx=3.2*Math.sin(tFlow*2*Math.PI/0.9);sy=0.8*Math.cos(tFlow*2*Math.PI/0.9);}
  $('dr-groep').setAttribute('transform','translate('+f1(sx)+' '+f1(sy)+')');
  $('swirl').setAttribute('opacity',swirl?'.85':'0');

  // het koffiebed: bolt op tijdens de bloom en wordt donker als het nat is
  const tb=t-starts[0];
  const puff=(fase==='klaar'||t<0)?0:5*Math.min(1,tb/5)*Math.max(0,1-Math.max(0,tb-10)/30);
  const yBed=niveau(VBED+puff);
  const nat=Math.min(1,sim.vast/(2*R.dose));
  ['bed-fill','bed-clip'].forEach(id=>{const e=$(id);e.setAttribute('y',f1(yBed));e.setAttribute('height',f1(APEX-yBed+8));});
  $('bed-fill').setAttribute('opacity',(0.2+0.4*nat).toFixed(2));
  const bol=puff>0.3?-3*(puff/5):1.4;
  $('bed-top').setAttribute('d','M'+f1(xL(yBed)+1)+' '+f1(yBed)+' Q'+CX+' '+f1(yBed+bol*2)+' '+f1(xR(yBed)-1)+' '+f1(yBed));
  $('bel').classList.toggle('aan',!rm&&bezig&&tb>1&&tb<40);
  $('bel').setAttribute('transform','translate(0 '+f1(yBed)+')');

  // de vloeistof boven het bed
  const nat2=sim.V>0.4;
  const yL=niveau(VBED+puff+sim.V);
  $('dr-fill').setAttribute('y',f1(yL)); $('dr-fill').setAttribute('height',nat2?f1(yBed-yL+3):'0');
  $('dr-crema').setAttribute('y',f1(yL)); $('dr-crema').setAttribute('height',nat2?f1(Math.min(4,yBed-yL+1)):'0');
  $('dr-opp').setAttribute('d',nat2?('M'+f1(xL(yL))+' '+f1(yL)+' Q'+CX+' '+f1(yL+5)+' '+f1(xR(yL))+' '+f1(yL)):'');

  // de straal uit de tuit: groeit naar beneden, laat aan het eind van boven los
  const lopend=(fase==='loopt'||fase==='af');
  if(giet){anim.staart=0;anim.kop=rm?1:Math.min(1,anim.kop+(lopend?dtR*6:0));}
  else if(anim.kop>0){
    anim.staart=rm?1:Math.min(1,anim.staart+(fase==='pauze'?0:dtR*6));
    if(anim.staart>=1){anim.kop=0;anim.staart=0;}
  }
  const P=[CX+dx+sx,(nat2?yL:yBed)+1];
  if(anim.kop>0){
    const c1=rot([TIP[0]+6,TIP[1]+3],PIV,anim.hoek); c1[0]+=kx; c1[1]+=ky;
    const c2=[P[0],tip[1]+(P[1]-tip[1])*0.45];
    $('straal').setAttribute('d',pad(deel([tip,c1,c2,P],anim.staart,anim.kop)));
    $('straal-b').setAttribute('d',pad(deel([[tip[0]+1.2,tip[1]+0.6],[c1[0]+1.4,c1[1]],[c2[0]+1.3,c2[1]],[P[0]+1,P[1]]],anim.staart,anim.kop)));
  }else{$('straal').setAttribute('d','');$('straal-b').setAttribute('d','');}
  const off=rm?0:((-tFlow*42)%16);
  $('straal').style.strokeDashoffset=off; $('straal-b').style.strokeDashoffset=off;

  // druppels of een straaltje naar de server
  const q=sim.q, outY=G.OUT;
  const yS=Math.max(G.SV_TOP,SV_BODEM-sim.S*SV_PER_G);
  const drup=q>0.04&&fase!=='klaar';
  const drip=$('drip');
  if(drup){
    const x0=CX+sx, klein=q<0.7;
    drip.setAttribute('d','M'+f1(x0)+' '+outY+' Q'+f1(x0+0.8)+' '+f1((outY+yS)/2)+' '+CX+' '+f1(yS+1));
    drip.classList.toggle('druppel',klein);
    drip.style.strokeWidth=klein?'2.4':(1.2+Math.min(q,4)*0.4).toFixed(2);
    drip.style.strokeDashoffset=rm?0:((-tFlow*(klein?30:42))%(klein?11.5:16));
    drip.setAttribute('opacity','1');
  }else drip.setAttribute('opacity','0');
  $('rimpel').classList.toggle('aan',drup&&!rm);
  $('rimpel').setAttribute('transform','translate('+CX+' '+f1(yS)+')');

  // de server vult
  $('sv-fill').setAttribute('y',f1(yS)); $('sv-fill').setAttribute('height',sim.S>0.5?f1(SV_BODEM+12-yS):'0');
  $('sv-crema').setAttribute('y',f1(yS)); $('sv-crema').setAttribute('height',sim.S>2?'3':'0');

  // de klep van de Switch: hendeltje omhoog = dicht, omlaag = open
  if(R.zetter==='switch'){
    const o=klepOpen(tt);
    const dk=o?16:-18, db=o?-5:0;
    anim.klep=rm?dk:anim.klep+(dk-anim.klep)*Math.min(1,dtR*6);
    anim.bal=rm?db:anim.bal+(db-anim.bal)*Math.min(1,dtR*6);
    $('klep-arm').setAttribute('transform','rotate('+f1(anim.klep)+' 187 224)');
    $('bal').setAttribute('transform','translate(0 '+f1(anim.bal)+')');
    const tag=$('klep-tag'); tag.textContent=o?'valve open':'valve closed';
    tag.classList.toggle('open',o);
  }
}

/* ---- de woorden op het scherm ---- */
function zet(id,html){if(cache[id]!==html){cache[id]=html;$(id).innerHTML=html;}}
function label(s){
  if(s.g)return s.k==='bloom'?('bloom · '+s.g+' g'):('pour to '+s.g+' g');
  let x=esc(GC_NAAM[s.k]||s.k);
  if(s.wissel)x+=' · valve '+(s.wissel==='open'?'open':'closed');
  return x;
}
function droogTekst(){
  const l=S.length-1, a=starts[l]+(R.droog[0]-S[l].t), b=starts[l]+(R.droog[1]-S[l].t);
  return a===b?('dry ~'+fmt(a)):('dry '+fmt(a)+'–'+fmt(b));
}
function grootGetal(txt){
  return txt.split('').map(ch=>ch===':'?'<span class="dp">:</span>':'<span class="c">'+ch+'</span>').join('');
}
function render(){
  const i=cur(), s=S[i], bezig=(fase==='loopt'||fase==='pauze'||fase==='aftel');
  const sw=R.zetter==='switch';

  // de teller
  const tel=(t<0&&bezig);
  zet('tijd',grootGetal(tel?String(Math.max(1,Math.ceil(-t-1e-6))):fmt(fase==='af'?eindT:Math.max(0,t))));
  $('tijd').classList.toggle('tel',tel);
  linUpdate();

  // info
  zet('info-l',esc([R.dose+' g',water+' g water',R.temp?(R.temp+' °C'):'',R.maling].filter(Boolean).join(' · ')));
  const wk=bezig&&fase!=='pauze'?(wakeStatus==='aan'?'screen stays on':(wakeStatus?'screen may dim':'')):'';
  zet('info-r',[wk,speed>1?speed+'× demo':''].filter(Boolean).join(' · '));

  // vorige
  const prep=(sw?'valve closed, ':'')+'paper rinsed, '+R.dose+' g in';
  let v;
  if(fase==='klaar')v='<span class="tt">before</span><span class="v-wat">'+prep+'</span>';
  else if(fase==='af')v='<span class="tt">'+fmt(starts[i])+'</span>'+GC_VINK+'<s>'+label(S[i])+'</s>';
  else if(i===0)v='<span class="tt">before</span>'+GC_VINK+'<s>'+prep+'</s>';
  else v='<span class="tt">'+fmt(starts[i-1])+'</span>'+GC_VINK+'<s>'+label(S[i-1])+'</s>';
  zet('r-vorige',v);

  // nu
  let wat, doel='', dcls='', d, balk=0, tl='', tr='';
  if(fase==='af'){
    wat='done'; doel=fmt(eindT);
    d=(pc.draw!=null?('drawdown '+fmt(pc.draw)+' after the last pour. '):'')+'The times are in your brew below.';
    balk=1;
  }else{
    wat=s.g?(s.k==='bloom'?'bloom':'pour to'):esc(GC_NAAM[s.k]||s.k);
    if(s.g)doel=s.g+' g';
    else if(s.k==='doorloop'){doel=droogTekst();dcls=doel.length>9?'lang':'';}
    else if(s.k==='wacht'&&i<S.length-1){doel='until '+fmt(starts[i+1]);dcls='lang';}
    else {doel=s.van+' g';dcls='stil';}
    d=(s.wissel?('<span class="klep-chip">'+KLEP_ICOON[s.wissel]+(s.wissel==='open'?'valve open':'valve closed')+'</span>'):'')+esc(s.d);
    if(fase==='klaar'){tl='tap start, then pick up the kettle';}
    else if(t<0){tl='pick up the kettle';}
    else if(s.g){
      const f=klem((t-starts[i])/s.dur,0,1); balk=f;
      if(f<1){tl='~'+Math.round(s.van+s.a*f)+' g by now';tr=fmtIn(starts[i]+s.dur-t)+' left';}
      else tl='at '+s.g+' g, '+((sw&&!klepOpen(t))?'let it steep':(s.k==='bloom'?'let it bloom':'let it drain'));
    }else if(s.k==='doorloop'||i===S.length-1){
      const e=eindVerwacht(); balk=klem((t-starts[i])/Math.max(1,e-starts[i]),0,1);
      tl=droogOp!=null?'looks dry — tap done':'still draining';
    }else{
      balk=klem((t-starts[i])/Math.max(1,starts[i+1]-starts[i]),0,1);
      tl=s.k==='swirl'?'a few gentle turns':'hands off';
    }
  }
  zet('r-nu','<div class="nu-kop"><span class="nu-wat">'+wat+'</span><span class="nu-doel '+dcls+'">'+doel+'</span></div>'+
    '<div class="nu-d">'+d+'</div><div class="nu-balk"><i style="width:'+(balk*100).toFixed(1)+'%"></i></div>'+
    '<div class="nu-tempo"><span>'+tl+'</span><span>'+tr+'</span></div>');
  const sleutel=fase==='af'?'af':i;
  if(sleutel!==vorigeCur){
    if(vorigeCur!==-1&&!RM.matches){const nu=$('r-nu');nu.classList.remove('land');void nu.offsetWidth;nu.classList.add('land');}
    vorigeCur=sleutel;
  }

  // straks
  let n, bijna=false;
  if(fase==='af')n='<span class="n-lbl">next</span><span class="n-wat">taste it, then log the brew</span>';
  else if(i<S.length-1){
    const over=starts[i+1]-Math.max(0,t);
    bijna=(fase==='loopt'||fase==='pauze')&&over<=GC_VOORAF;
    n='<span class="n-lbl">next</span><span class="n-wat">'+label(S[i+1])+'</span><span class="n-in">in '+fmtIn(over)+'</span>';
  }else n='<span class="n-lbl">next</span><span class="n-wat">'+(droogOp!=null?'tap done':'tap done when the bed is dry')+'</span>';
  zet('r-volg',n);
  $('r-volg').classList.toggle('bijna',bijna);

  // knoppen
  zet('b-start',{klaar:'start',aftel:'pause',loopt:'pause',pauze:'resume',af:'log it'}[fase]);
  const bv=$('b-volg');
  bv.disabled=(fase==='klaar'||fase==='af');
  zet('b-volg',(!bv.disabled&&t>=0&&i===S.length-1)?'done':'next step');
  bv.classList.toggle('nadruk',droogOp!=null&&fase!=='af');
  const bs=$('b-stem');
  zet('b-stem',(stem?GC_STEM_AAN:GC_STEM_UIT)+'<span>'+(stem?'voice on':'voice off')+'</span>');
  bs.classList.toggle('aan',stem); bs.setAttribute('aria-pressed',stem?'true':'false');
}

/* ---- de lus: alleen zolang de coach open is ---- */
let last=0;
function frame(now){
  if(!open){raf=0;return;}
  const ruw=Math.max(0,(now-last)/1000); last=now;
  const dtR=Math.min(ruw,0.1);
  if(fase==='aftel'||fase==='loopt'||fase==='af'){
    let dt=ruw*speed; const t0=t;
    if(fase==='af'&&sim.V<0.05&&sim.q<0.01)dt=0;    // alles is doorgelopen
    t+=dt; tFlow+=dt;
    if(fase==='af')t=Math.max(t,eindT);
    if(fase==='aftel'&&t>=0)fase='loopt';
    if(t>0)simuleer(Math.max(0,t0),t);
  }
  if((fase==='loopt'||fase==='pauze')&&droogOp==null&&cur()===S.length-1&&t>gietEinde()&&sim.V<0.8)droogOp=t;
  stemCheck();
  teken(dtR);
  render();
  raf=requestAnimationFrame(frame);
}
/* Op de achtergrond loopt requestAnimationFrame niet. Omdat de klok op het
   verschil tussen twee tijdstempels loopt, staat hij bij terugkomst toch op
   de echte tijd (het model rekent de tussentijd in stapjes na).           */

/* ---- openen en sluiten ---- */
function maak(){
  if(document.getElementById('gietcoach'))return;
  const el=document.createElement('div');
  el.id='gietcoach'; el.className='gc'; el.hidden=true;
  el.setAttribute('role','dialog'); el.setAttribute('aria-modal','true'); el.setAttribute('aria-label','pour coach');
  el.innerHTML=
    '<div class="gc-top"><div class="gc-naam" id="gc-naam"></div>'+
    '<button type="button" class="ik rand" id="gc-b-dicht" aria-label="close">'+GC_KRUIS+'</button></div>'+
    '<div class="gc-info"><span id="gc-info-l"></span><span class="r" id="gc-info-r"></span></div>'+
    '<div class="gc-tek">'+GC_TEKENING+
      '<div class="gc-zegt rand" id="gc-zegt" aria-hidden="true">'+GC_STEM_AAN+'<span></span></div></div>'+
    '<div class="gc-klok"><div class="gc-tijd" id="gc-tijd" aria-live="off"></div>'+
      '<div class="lin-rij"><span>0:00</span><div class="lin" id="gc-lin"><div class="lin-as"></div>'+
      '<div class="lin-ged" id="gc-lin-ged"></div><div class="lin-nu" id="gc-lin-nu"></div></div>'+
      '<span id="gc-lin-eind"></span></div></div>'+
    '<div class="gc-strook"><div class="r-vorige" id="gc-r-vorige"></div>'+
      '<div class="r-nu rand" id="gc-r-nu"></div><div class="r-volg rand" id="gc-r-volg"></div></div>'+
    '<div class="gc-knoppen">'+
      '<button type="button" class="kn kn-stem rand" id="gc-b-stem" aria-pressed="false"></button>'+
      '<button type="button" class="kn kn-start rand" id="gc-b-start">start</button>'+
      '<button type="button" class="kn kn-volg rand" id="gc-b-volg" disabled>next step</button></div>'+
    '<div class="gc-toast rand" id="gc-toast" role="status"></div>';
  document.body.appendChild(el);
  let h='';
  for(let x=40;x<260;x+=6)h+='<path d="M'+x+' 236 Q'+(x+20)+' 200 '+(x+46)+' 160"/>';
  $('arcering').innerHTML=h;
  $('b-dicht').addEventListener('click',dichtKnop);
  $('b-stem').addEventListener('click',stemKnop);
  $('b-start').addEventListener('click',startKnop);
  $('b-volg').addEventListener('click',volgende);
}
function openen(){
  if(!pc.steps.length)pourBuild();
  if(!pc.steps.length){toast('no schedule yet — write a recipe first');return;}
  maak(); cache={};
  try{stem=localStorage.getItem('scc_gc_stem')==='1';}catch(e){}   // gedeeld met de andere coaches
  bouw();
  const el=document.getElementById('gietcoach');
  el.hidden=false; document.body.classList.add('gc-open'); open=true;
  last=performance.now();
  if(!raf)raf=requestAnimationFrame(frame);
}
function dichtKnop(){
  if(fase==='aftel'||fase==='loopt'||fase==='pauze'){
    if(!confirm('stop this brew? the times so far go into your brew'))return;
    if(t>0)klaar(); else reset();
  }
  sluit();
}
function sluit(){
  open=false; wakeUit();
  BrewStem.stil();
  const el=document.getElementById('gietcoach'); if(el)el.hidden=true;
  document.body.classList.remove('gc-open');
  if(raf){cancelAnimationFrame(raf);raf=0;}
}
return {openen,sluit,isOpen:()=>open,snelheid:n=>{speed=n>1?n:1;},
        stand:()=>({fase,t,eindT,cur:cur(),starts:starts.slice(),S:S.map(x=>({t:x.t,g:x.g,k:x.k,dur:x.dur,wissel:x.wissel})),water,droog:R&&R.droog,serverG:sim.S})};
})();
function gcOpen(){gc.openen();}
