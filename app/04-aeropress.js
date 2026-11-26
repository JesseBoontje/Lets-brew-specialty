/* De tekening uit docs/opzet-aeropress.html: kop, dop, kamer, plunjer, ketel, roerstokje en schepje als losse delen. De ketel is de schenkkan (docs/tekeningen/schenkkan-schoon.svg, 0.33x, overtrek.py 7/3.6/3), kantelt om het handvat (262,57), tuit-haakje op (134,35). Alle ids beginnen met ap-. */
const AP_TEKENING="<svg id=\"ap-tek\" class=\"stil\" viewBox=\"-6 0 272 344\" preserveAspectRatio=\"xMidYMid meet\" role=\"img\" aria-label=\"the AeroPress with kettle and cup\">\n<defs>\n<clipPath id=\"ap-clip-ch\"><rect x=\"102.6\" y=\"141\" width=\"54.8\" height=\"121.4\"/></clipPath>\n<clipPath id=\"ap-clip-cup\"><path d=\"M88 275 L172 275 L166.5 333 L93.5 333\"/></clipPath>\n</defs>\n<path class=\"soft2\" d=\"M8 337.4 Q130 341.6 252 336.4\"/>\n<path class=\"soft2\" d=\"M20 339.8 Q131 343.2 240 338.8\"/>\n<g id=\"ap-G\">\n<g id=\"ap-cupG\">\n<g clip-path=\"url(#ap-clip-cup)\">\n<rect id=\"ap-cupLiq\" class=\"liq\" x=\"80\" y=\"333\" width=\"100\" height=\"0\"/>\n<rect id=\"ap-cupCr\" class=\"crema\" x=\"80\" y=\"333\" width=\"100\" height=\"0\"/>\n</g>\n<path d=\"M82 271.5 Q130 265 178 271\"/><path class=\"b\" d=\"M86 273.5 Q131 268.2 175 272.6\"/>\n<path d=\"M83 273 Q130 280.5 177 272.4\"/><path class=\"b\" d=\"M88 275.6 Q129 281.4 173 274.8\"/>\n<path d=\"M85 268 Q87.5 300 93.5 336.4\"/><path class=\"b\" d=\"M88.6 272 Q90.4 302 95.8 333.4\"/>\n<path d=\"M175.5 268 Q173 300 167 336.4\"/><path class=\"b\" d=\"M172.4 271.5 Q170.8 302 164.6 333.4\"/>\n<path d=\"M88 332.6 Q130 338.6 172 331.6\"/><path class=\"b\" d=\"M93 334.8 Q129 339.2 168 333.4\"/>\n<path d=\"M175 284 Q199 283 198.5 300 Q198 317 171 318.4\"/><path class=\"b\" d=\"M173.5 289.5 Q192 289.6 191.6 301 Q191 312 170.6 312.4\"/>\n</g>\n<g id=\"ap-pressG\">\n<g id=\"ap-bedG\">\n<path class=\"bed\" d=\"M104 0.6 Q114 -6.4 124 -4.2 Q134 -8.6 144 -4 Q151 -2.4 156.4 0.8\"/>\n<path class=\"bed b\" d=\"M106.6 -1 Q117 -4.6 127 -3 Q137 -6.4 146 -2.6 Q152 -1.4 155 -0.4\"/>\n<path class=\"soft2\" d=\"M113 -2.6 l2.4 -1.6\"/><path class=\"soft2\" d=\"M121 -3 l2 1.4\"/>\n<path class=\"soft2\" d=\"M133 -5 l2.4 -1\"/><path class=\"soft2\" d=\"M141 -3.4 l1.8 1.6\"/>\n<path class=\"soft2\" d=\"M148 -1.8 l2.2 -1.2\"/>\n</g>\n<g id=\"ap-chM\">\n<g clip-path=\"url(#ap-clip-ch)\">\n<g id=\"ap-liqT\">\n<rect id=\"ap-chLiq\" class=\"liq\" x=\"70\" y=\"262\" width=\"120\" height=\"0\"/>\n<rect id=\"ap-chCr\" class=\"crema\" x=\"70\" y=\"262\" width=\"120\" height=\"0\"/>\n</g>\n</g>\n<path d=\"M94.5 139.6 Q130 134.6 165.8 139.2\"/><path class=\"b\" d=\"M97.6 141.6 Q131 137.6 162.8 141.4\"/>\n<path class=\"soft2\" d=\"M99 142.4 Q130 147 161.4 142\"/>\n<path d=\"M99.6 134.6 Q97.4 196 100.8 257.6\"/><path class=\"b\" d=\"M102.8 140.4 Q100.6 197 103.4 254.6\"/>\n<path d=\"M160.8 134.4 Q163 196 159.4 257.8\"/><path class=\"b\" d=\"M157.6 140.6 Q159.8 197 156.6 254.4\"/>\n<path d=\"M74 254.4 Q130 249.4 186.6 255\"/><path class=\"b\" d=\"M78.4 256.4 Q129 252 182.4 256.8\"/>\n<path d=\"M73.4 261.4 Q130 265.6 187 260.6\"/><path class=\"b\" d=\"M77.6 262.6 Q131 266.4 183.6 262.2\"/>\n<path d=\"M77 251.8 Q71.6 257.8 76.6 264.2\"/><path d=\"M183.4 251.6 Q189 257.6 184 264\"/>\n<path class=\"soft2\" d=\"M104 166 Q111 165 117 166.4\"/><text class=\"nr\" x=\"120\" y=\"169\">4</text>\n<path class=\"soft2\" d=\"M104 188 Q111 187.2 117 188.4\"/><text class=\"nr\" x=\"120\" y=\"191\">3</text>\n<path class=\"soft2\" d=\"M104 210 Q111 209 117 210.4\"/><text class=\"nr\" x=\"120\" y=\"213\">2</text>\n<path class=\"soft2\" d=\"M104 232 Q111 231.2 117 232.4\"/><text class=\"nr\" x=\"120\" y=\"235\">1</text>\n</g>\n<g id=\"ap-capG\">\n<path class=\"soft2\" d=\"M101 261 Q130 263.4 159 260.6\"/>\n<path d=\"M95 262.4 Q130 258.8 165.6 262\"/><path class=\"b\" d=\"M98.6 264.2 Q131 261.4 162.4 263.8\"/>\n<path d=\"M97 270.4 Q130 273.4 163.4 269.8\"/><path class=\"b\" d=\"M100.4 271.8 Q129 274.4 160.6 271.2\"/>\n<path d=\"M97.4 259.6 Q95.6 266 98.2 273\"/><path d=\"M163 259.4 Q165 266 162 272.8\"/>\n<path class=\"soft2\" d=\"M106 264.5 Q106.5 267.5 106 270.5\"/><path class=\"soft2\" d=\"M114 264.6 Q114.4 267.6 114 270.8\"/>\n<path class=\"soft2\" d=\"M122 264.4 Q122.6 267.6 122 270.9\"/><path class=\"soft2\" d=\"M130 264.3 Q130.4 267.6 130 271\"/>\n<path class=\"soft2\" d=\"M138 264.4 Q138.5 267.6 138 270.9\"/><path class=\"soft2\" d=\"M146 264.5 Q146.4 267.6 146 270.8\"/>\n<path class=\"soft2\" d=\"M154 264.6 Q154.5 267.5 154 270.5\"/>\n</g>\n<g id=\"ap-plG\">\n<path d=\"M100.6 -8.6 Q130 -11.8 159.6 -8.2\"/><path class=\"b\" d=\"M103 -6.8 Q130 -9.4 157.4 -6.4\"/>\n<path class=\"seal\" d=\"M101 0.6 Q130 3.4 159.2 0.2\"/><path class=\"b\" d=\"M103.4 -1.8 Q130 0.8 157 -2\"/>\n<path d=\"M101.4 -11 Q99.8 -4.4 102 2.6\"/><path d=\"M158.8 -11.2 Q160.6 -4.6 158.2 2.4\"/>\n<path d=\"M106 -7 Q104 -62 106.8 -119.4\"/><path class=\"b\" d=\"M108.8 -9.6 Q107 -62 109.4 -116.8\"/>\n<path d=\"M154.2 -7.2 Q156.4 -62 153.4 -119.6\"/><path class=\"b\" d=\"M151.6 -9.4 Q153.6 -62 150.8 -117\"/>\n<path class=\"soft2\" d=\"M118 -14 Q117 -62 118.6 -110\"/>\n<path d=\"M88.4 -115.4 Q130 -119.6 171.4 -114.8\"/><path class=\"b\" d=\"M92.6 -113.6 Q131 -117.4 167.6 -113.2\"/>\n<path d=\"M89.6 -123.4 Q130 -128.2 170.6 -122.8\"/><path class=\"b\" d=\"M93.4 -125.4 Q129 -129.4 166.8 -124.8\"/>\n<path d=\"M91.2 -126.6 Q86.2 -120 90.8 -111.8\"/><path d=\"M168.6 -126.4 Q173.6 -119.8 169.2 -111.6\"/>\n</g>\n</g>\n</g>\n<path id=\"ap-drip\" class=\"stream\" d=\"\"/>\n<g id=\"ap-kettle\" class=\"kan\">\n<path d=\"M191.1 30.5 L193.9 29.6 L197.3 28.7 L204.3 27.5 L210.8 27 L218 27 L233.6 28.4 L239.9 29.3 L241.5 29.8 L242.6 30.4 L244.9 33.2\" stroke-width=\"1.4\" opacity=\"0.97\"/>\n<path d=\"M191.5 30.4 L194.9 29.6 L198.8 29 L203.5 28.6 L209.5 28.4 L219.9 28.7 L235.1 29.9\" stroke-width=\"0.7\" opacity=\"0.62\"/>\n<path d=\"M203.6 28.2 L209.1 27.4 L214.1 27 L221.6 27 L226 27.4 L231.5 28.2 L237.1 29.2 L240.2 30.1\" stroke-width=\"0.69\" opacity=\"0.76\"/>\n<path d=\"M198.2 26.9 L205.8 26.2 L213.7 26.2 L221 27 L229.5 28.3\" stroke-width=\"0.68\" opacity=\"0.67\"/>\n<path d=\"M197 28.2 L203.6 27.3 L209.9 27.2 L215.8 27.7 L225.7 28.9 L237.6 29.4 L240 29.7 L242 30.4\" stroke-width=\"0.81\" opacity=\"0.73\"/>\n<path d=\"M205.3 28.5 L227.6 28.8\" stroke-width=\"0.75\" opacity=\"0.62\"/>\n<path d=\"M200.2 28.3 L207.2 27.9 L215 27.8 L221.9 28.2 L231 29.4\" stroke-width=\"0.65\" opacity=\"0.69\"/>\n<path d=\"M189.1 30.8 L189.8 31.3 L191.5 31.8 L196.3 32.6 L215.3 34.5 L221.1 34.8 L225.2 34.7 L232.4 34.1 L236.2 33.4 L239 32.6 L241.3 31.4 L243.6 28.7\" stroke-width=\"1.4\" opacity=\"0.97\"/>\n<path d=\"M201.7 35.3 L210.5 37 L217.2 37.5 L226.5 37.2 L240.2 35.8\" stroke-width=\"0.72\" opacity=\"0.78\"/>\n<path d=\"M200.5 33.3 L215.5 34.7 L228.5 35.4\" stroke-width=\"0.69\" opacity=\"0.74\"/>\n<path d=\"M190.4 32.9 L199.7 33.9 L209.9 35.3 L215 35.8 L218.6 35.7 L222 35.4 L232.6 33.5\" stroke-width=\"0.74\" opacity=\"0.89\"/>\n<path d=\"M204.7 34.4 L209.7 34.2 L221.8 32.9 L236.5 32.8\" stroke-width=\"0.81\" opacity=\"0.76\"/>\n<path d=\"M207.6 35 L214.4 34.9 L222 34.1 L230.7 32.4 L237.3 30.4\" stroke-width=\"0.74\" opacity=\"0.78\"/>\n<path d=\"M190.7 32.2 L193.1 32.8 L196.9 33.5 L206.1 34.2 L216 34.3 L236.2 33.8 L239.9 33.3 L241.7 32.7 L247.2 27.6\" stroke-width=\"0.81\" opacity=\"0.73\"/>\n<path d=\"M198.4 31 L206.1 30.6 L220.2 30.7 L235 30.5 L240.7 30.7 L245.3 31.6\" stroke-width=\"1.4\" opacity=\"0.97\"/>\n<path d=\"M202.1 30.5 L210.5 30.8 L221.4 29.9 L225.3 29.8 L229.2 30.1 L233.2 30.8\" stroke-width=\"0.77\" opacity=\"0.7\"/>\n<path d=\"M194.5 30.6 L199.9 29.9 L205.5 29.9 L210.2 30.3 L220.8 31.7 L228.4 32.3\" stroke-width=\"0.74\" opacity=\"0.71\"/>\n<path d=\"M186.9 32.9 L191.4 32 L199.6 29.7 L203 29.1 L206.6 28.9 L211.2 29 L223.3 30.2 L237.5 30 L240.6 30.3 L244.5 31.1\" stroke-width=\"0.66\" opacity=\"0.67\"/>\n<path d=\"M197.5 31.3 L204.8 30.4 L213.5 29.9 L225 29.7 L234.6 30\" stroke-width=\"0.71\" opacity=\"0.76\"/>\n<path d=\"M192.8 33 L217.4 29.3 L222.7 28.6 L229.5 28.4 L236.5 29\" stroke-width=\"0.77\" opacity=\"0.86\"/>\n<path d=\"M196.2 29.5 L203.9 29.8 L215.4 29.4 L220 29.5 L225.5 30.3 L231.5 31.9\" stroke-width=\"0.66\" opacity=\"0.75\"/>\n<path d=\"M188.3 28 L187.6 48.7 L188.1 93.7 L188.7 98.1 L189.8 101.7 L190.5 103.2 L194.6 109.2\" stroke-width=\"1.4\" opacity=\"0.97\"/>\n<path d=\"M187.6 50 L188.6 61.6 L188.9 69 L188.8 77.3 L187.9 89.2 L187.9 92.3 L188.2 95.3\" stroke-width=\"0.81\" opacity=\"0.79\"/>\n<path d=\"M190 47.7 L188.7 57.7 L186.9 78.7 L185.8 88.5\" stroke-width=\"0.67\" opacity=\"0.66\"/>\n<path d=\"M189.9 38.1 L188.4 49 L187.9 55 L187.7 63 L188.1 78.9 L187.1 94.2\" stroke-width=\"0.66\" opacity=\"0.61\"/>\n<path d=\"M189 51.1 L188.5 72.2 L187.5 89.6\" stroke-width=\"0.8\" opacity=\"0.68\"/>\n<path d=\"M187.3 28.8 L186.6 42.2 L186.8 59.7 L186.6 69.4 L186.1 77.8 L184.7 90.8 L184.6 95.3 L184.9 98.9 L185.9 102.7 L187 105.1 L189.4 108.8\" stroke-width=\"0.81\" opacity=\"0.89\"/>\n<path d=\"M190.3 27.6 L189.4 48.5 L187.1 71.2 L186.4 79.3 L186.1 87.9 L186.1 92 L186.9 97.8 L188.1 101.6 L189.2 103.6 L194.6 111.7\" stroke-width=\"0.61\" opacity=\"0.61\"/>\n<path d=\"M243.7 28 L244 40.1 L243.4 55 L243.6 62.3 L244.2 68.8 L246.4 84.3 L246.8 89.4 L246.5 94.8 L245.8 99.1\" stroke-width=\"1.4\" opacity=\"0.97\"/>\n<path d=\"M245.2 38.7 L245.6 48.9 L245.6 57.2 L245.3 64.7 L244.3 78.6 L244.1 87.1\" stroke-width=\"0.78\" opacity=\"0.6\"/>\n<path d=\"M241.7 53.5 L242.7 68.4 L244 82.5\" stroke-width=\"0.66\" opacity=\"0.6\"/>\n<path d=\"M243.4 54 L244.3 69.7 L244.4 78.7 L244.1 89.4 L243.2 95.9\" stroke-width=\"0.62\" opacity=\"0.85\"/>\n<path d=\"M242.2 26.9 L242.9 39.6 L242.9 55.6 L243.2 63 L244.2 71.5 L247 87.3 L247.3 93.4 L247 98.2 L246.2 101.6 L245 104.3 L242.2 109.2\" stroke-width=\"0.77\" opacity=\"0.82\"/>\n<path d=\"M238 25.4 L238.7 33.3 L239.1 46.8 L239.7 54.2 L240.9 61.9 L244.3 80.4 L245.1 86 L245.4 90.3 L245.3 95.5 L244.6 100.3 L243.7 102.9 L241.8 106.7\" stroke-width=\"0.77\" opacity=\"0.77\"/>\n<path d=\"M240.1 35.1 L244.1 61.1 L246.8 84.5\" stroke-width=\"0.68\" opacity=\"0.74\"/>\n<path d=\"M187.5 102 L195 104.9 L200.8 106.7 L206.9 108.1 L212.9 108.8 L217.6 108.9 L223.8 108.4 L229.6 107.5 L237.6 105.8\" stroke-width=\"1.4\" opacity=\"0.97\"/>\n<path d=\"M202.1 104.7 L213.1 107.2 L220 108.3 L228 108.9 L235.3 108.8\" stroke-width=\"0.74\" opacity=\"0.79\"/>\n<path d=\"M197.1 105.3 L200.8 106.4 L204.5 107 L218.1 108 L228.5 109.2 L233.6 109.5\" stroke-width=\"0.7\" opacity=\"0.74\"/>\n<path d=\"M204.4 105.2 L227.4 107.8 L233.7 107.9 L237.3 107.5 L239.8 107.1\" stroke-width=\"0.62\" opacity=\"0.63\"/>\n<path d=\"M188.3 104.5 L194.8 106.4 L201.6 107.7 L209.2 108.5 L217.2 108.9 L225.7 108.5 L233.5 107.6 L240.9 106.1 L247 104\" stroke-width=\"0.7\" opacity=\"0.69\"/>\n<path d=\"M191.4 104.6 L196.6 105.9 L203.5 106.7 L214.9 107 L227.7 106.8 L234.1 106.5 L238.6 106 L242.3 105.3 L249.1 103.4\" stroke-width=\"0.66\" opacity=\"0.71\"/>\n<path d=\"M184.1 101.9 L189.4 103.8 L193.8 104.6 L205.9 105.7 L215.3 106.8 L222 107.1 L227 106.7 L232.3 105.6 L236.5 104.3 L241.3 102.4 L246.7 100.7\" stroke-width=\"0.7\" opacity=\"0.69\"/>\n<path d=\"M193.4 94.6 L184.8 95.3 L182 95.1 L178.6 94.4 L174.7 93.1 L171.5 91.4 L169.7 89.9 L168.1 88 L167 86.2 L165.9 83.9 L164.1 78.5 L163.3 74.7 L162 66.4 L160.4 58.4 L157.5 46.3 L156.5 43.7 L155 40.8 L153.5 38.7 L151.8 37 L149.6 35.3 L146.9 34 L143.7 33.3 L140.7 32.9 L138.1 32.9 L135.5 33.1 L127 35.1\" stroke-width=\"1.4\" opacity=\"0.97\"/>\n<path d=\"M169.6 89.4 L167.5 87.3 L165.9 84.9 L164.3 81.5 L163 78 L161.9 73.6 L157.2 47 L156 43.2 L154.3 39.8 L152.8 37.6 L151.3 36.1 L149.3 34.6 L147.4 33.5 L144.4 32.7 L141.4 32.2 L138.1 32 L136.1 32.2\" stroke-width=\"0.64\" opacity=\"0.72\"/>\n<path d=\"M172.8 89.6 L171 88.3 L169.2 86.4 L167.5 83.9 L166.1 81.1 L164.8 77.8 L163.8 74.6 L160.1 59.3 L156.4 46.5 L154.7 42.8 L153.2 40.6 L151.3 38.5 L149.4 37\" stroke-width=\"0.71\" opacity=\"0.67\"/>\n<path d=\"M178.5 93.8 L173.4 92.2 L171 91.1 L169.6 90.1 L167.9 88.5 L166.7 87 L165.1 84.6 L164 82.4 L162.5 78.6 L161.2 73.3 L160.1 65.3 L158.3 48.8 L157.7 45.2 L156.6 42 L155.2 39.4 L153.7 37.4 L151.9 35.8\" stroke-width=\"0.69\" opacity=\"0.76\"/>\n<path d=\"M164.2 79 L162.6 73.7 L160.3 61.5 L158.1 50.7 L157.1 46.5 L156.1 43.7 L154.1 39.9 L151.8 37 L150.4 35.9 L148.8 34.9 L146 33.8\" stroke-width=\"0.69\" opacity=\"0.73\"/>\n<path d=\"M186 95.7 L182.7 95.5 L180.2 95.1 L177.6 94.4 L174.6 93.3 L171.8 91.8 L170.2 90.6 L168.7 89.1 L167.4 87.2 L165.2 82.7 L163.5 77 L160.6 62.5 L157.5 48.2\" stroke-width=\"0.79\" opacity=\"0.89\"/>\n<path d=\"M174.4 92.3 L171.2 91 L168.5 88.8 L166 85.7 L163.9 81.9 L162.4 77.9 L161.4 74.5 L157.9 58.6 L155.2 47.7 L153.5 43.7 L151.4 40.4\" stroke-width=\"0.77\" opacity=\"0.67\"/>\n<path d=\"M192 97.2 L185 97.9 L181.9 97.8 L178 97.3 L175.4 96.6 L172.3 95.4 L168.9 93.6 L167.4 92.4 L165.8 90.6 L164.6 88.7 L163.3 86.1 L162.2 83 L160.6 77.5 L157.6 62.5 L154.2 48.9 L153 45.8 L151.2 42.4 L149.8 40.8 L148.2 39.3 L146.2 38.1 L144.6 37.6 L141.1 36.9 L137.8 36.7 L128.5 37.1\" stroke-width=\"1.4\" opacity=\"0.97\"/>\n<path d=\"M174 93 L170.5 91.5 L169.2 90.7 L168.3 89.9 L166.1 87 L164.4 83.3 L163.4 80.2 L162.3 76 L159.5 61.7 L157.1 50.8 L156.1 46.9 L155.1 44.2\" stroke-width=\"0.79\" opacity=\"0.74\"/>\n<path d=\"M164.5 85.7 L163 82.1 L162 78.5 L158 60.6 L154.6 48.3\" stroke-width=\"0.71\" opacity=\"0.81\"/>\n<path d=\"M165.2 87.7 L162.9 83.3 L160.9 77.5 L154.7 51.2\" stroke-width=\"0.62\" opacity=\"0.79\"/>\n<path d=\"M161.9 83.4 L160.5 79.1 L159.7 76 L156.5 60.8 L153.6 48.5 L151.8 44.1 L150 41.4\" stroke-width=\"0.64\" opacity=\"0.73\"/>\n<path d=\"M185.6 97 L182.3 97.2 L179 97 L176.4 96.6 L173.5 95.7 L170.7 94.5 L168.6 93.3 L166.8 91.6 L165.4 89.7 L163.5 85.7 L162.1 81.3 L161.2 77.1 L160.1 69.4 L159 63.6 L157.6 57.8 L155.7 51.1\" stroke-width=\"0.82\" opacity=\"0.73\"/>\n<path d=\"M195.3 92.8 L184.9 94.9 L182.2 95.1 L179.1 95 L175.3 94.4 L171.9 93.4 L169.2 92.1 L166.9 90.3 L165.2 88.2 L164.1 86.3 L162.8 83.5 L161.8 80.7 L160.4 75.6 L158.3 64.6 L156.7 57.7 L154.7 50.5 L153.3 46.4 L151.3 42.7 L149.4 40.4 L147.2 38.5 L144.4 36.9\" stroke-width=\"0.76\" opacity=\"0.66\"/>\n<path d=\"M134.7 32.9 L133.6 33.3 L132.9 34.1 L132.7 34.9 L133.3 36.1 L134.1 36.4 L135 36.2 L135.6 35.5 L136.3 34.2\" stroke-width=\"1.4\" opacity=\"0.97\"/>\n<path d=\"M135.9 35.3 L135.6 35.5 L134 35 L133.5 35.3 L133.5 35.7 L134.1 35.8 L135 35.3 L135.5 35.3 L136.5 36.1\" stroke-width=\"0.66\" opacity=\"0.81\"/>\n<path d=\"M135.8 34.5 L134.7 34.5 L134 34.9 L133.8 35.7 L134 36.6 L134.6 37.2 L135.8 37.7 L136.7 37.6 L137.6 37.2\" stroke-width=\"0.81\" opacity=\"0.72\"/>\n<path d=\"M135.4 33.6 L134.7 34 L134 34.9 L133.9 35.7 L134.5 36.6 L135.1 36.8 L136 36.5 L136.7 35.5 L136.9 34.8\" stroke-width=\"0.68\" opacity=\"0.83\"/>\n<path d=\"M135 33.4 L134.6 35.1 L134.8 35.7 L135.8 36.2 L136.7 36.3\" stroke-width=\"0.66\" opacity=\"0.63\"/>\n<path d=\"M135.2 33.8 L134.4 34.2 L134.2 34.6 L134.3 34.8 L134.9 34.1 L136 34\" stroke-width=\"0.66\" opacity=\"0.77\"/>\n<path d=\"M134.1 32.6 L132.6 33.5 L132.2 34.2 L132.3 35.1 L132.8 35.7 L133.5 35.8 L134.2 35.3 L134.7 34.4\" stroke-width=\"0.71\" opacity=\"0.67\"/>\n<path d=\"M233.5 37.3 L260.8 36.4 L262.2 36.6 L262.9 37 L263.5 37.6 L263.9 38.7 L264 40.2 L262.2 59.3 L261.4 71.7 L261 73.4 L260.2 74.8 L259 76.1 L245.6 86.9 L240.9 90.3\" stroke-width=\"1.4\" opacity=\"0.97\"/>\n<path d=\"M265 38.3 L265.1 39.5 L264.3 55.8 L263.1 71.7 L262.3 74.1 L261 75.9 L259.3 77.4 L255.6 79.8\" stroke-width=\"0.62\" opacity=\"0.78\"/>\n<path d=\"M256.4 35.3 L260.9 35 L262.9 35.4 L263.7 36 L264.4 36.9 L264.8 37.9 L265 39.3 L264 58.2 L262.9 72.2 L262.3 74 L261.2 75.6 L259.9 77 L258.1 78.3\" stroke-width=\"0.64\" opacity=\"0.69\"/>\n<path d=\"M239.7 36.5 L261.7 36.1 L263 36.5 L263.9 37.2 L264.4 38.3 L264.6 39.9 L261.3 71.7 L260.7 73.4 L259.9 74.6 L258.5 76 L237.5 90.6\" stroke-width=\"0.75\" opacity=\"0.73\"/>\n<path d=\"M260.8 36.7 L262.8 36.9 L264.1 37.6 L264.9 38.9 L265.1 40.8 L264.5 49.7 L263.6 56.8 L262 65.9 L260.7 72.3 L260.4 73.3\" stroke-width=\"0.7\" opacity=\"0.65\"/>\n<path d=\"M263.7 36.7 L264.1 37.8 L264.4 39.1 L265.3 56.9 L265.5 65.1 L265.3 71.4 L264.7 73.5 L263.7 75.2 L262.4 76.5 L259.5 78.5\" stroke-width=\"0.63\" opacity=\"0.68\"/>\n<path d=\"M254 36.1 L259.1 35.8 L260.9 36 L261.8 36.4 L262.4 36.9 L262.9 37.7 L263.1 38.7 L261.6 58.2 L261.3 72 L260.7 73.9 L259.6 75.4\" stroke-width=\"0.62\" opacity=\"0.81\"/>\n<path d=\"M248.9 39.6 L259 39.3 L260 39.5 L260.6 40.1 L260.7 41.5 L260.1 49.4 L259.8 56.4 L259.9 71.7 L259.1 73.8 L257.8 75.5 L249 82.9 L240.7 89\" stroke-width=\"1.4\" opacity=\"0.97\"/>\n<path d=\"M249.9 38.5 L256.9 38.2 L259.1 38.4 L260 38.8 L260.6 39.6 L260.9 40.6 L260.9 41.7 L258.9 58.8 L257.7 71.7 L257.2 72.9 L256.4 73.9 L249.5 79.4\" stroke-width=\"0.73\" opacity=\"0.77\"/>\n<path d=\"M237.7 38.8 L243.1 38.7 L259.1 37.6 L259.9 37.7 L260.6 38.1 L261.2 38.7 L261.6 39.5 L261.8 41.2 L261.2 52.6 L260.2 64.8 L259.5 71.3 L258.6 73.1 L257.3 74.6 L250.7 79\" stroke-width=\"0.77\" opacity=\"0.83\"/>\n<path d=\"M248.6 41.4 L253.6 41.6 L259.8 41.6 L260 42.8 L259.6 56 L259 62.7 L258 68.9\" stroke-width=\"0.67\" opacity=\"0.82\"/>\n<path d=\"M254.8 40.1 L260.3 39.7 L260.9 39.9 L261.2 40.3 L261.4 41.6 L261.3 45.2 L260.7 54.3 L259.5 62.1 L257.5 71.5 L256.8 72.7 L255.8 73.6 L250.4 77\" stroke-width=\"0.61\" opacity=\"0.71\"/>\n<path d=\"M257.9 39.1 L261.3 39.3 L262.2 39.6 L262.7 40.5 L262.7 41.9 L259.6 59.1 L257.7 70.9 L257.3 71.7 L256.6 72.6 L252.2 75.4\" stroke-width=\"0.61\" opacity=\"0.65\"/>\n<path d=\"M260.8 39.6 L261.2 40.4 L261.4 41.9 L260.8 49.6 L259.9 56.2 L257.6 70.8 L257.4 71.6 L256.8 72.6 L256.1 73.3 L254.6 74.3\" stroke-width=\"0.82\" opacity=\"0.79\"/>\n<path d=\"M196.6 30.9 L196.3 41.7 L194.8 55.9 L194.5 60.9 L194.5 67.5 L195.3 81.1 L195.4 86 L195.1 92.8 L194 103.6 L193.7 111.8\" stroke-width=\"1.4\" opacity=\"0.97\"/>\n<path d=\"M196.8 56.6 L196.1 75.9 L196.2 84.4 L196.7 92.2\" stroke-width=\"0.65\" opacity=\"0.69\"/>\n<path d=\"M197 54.4 L195.4 80 L194.4 91.4\" stroke-width=\"0.73\" opacity=\"0.66\"/>\n<path d=\"M195 44.2 L196.2 64.5 L198.2 86.6\" stroke-width=\"0.73\" opacity=\"0.77\"/>\n<path d=\"M198.3 48.1 L197.7 56 L196.4 78.3 L195.4 86.8 L193.8 96.8\" stroke-width=\"0.69\" opacity=\"0.76\"/>\n<path d=\"M196.5 53.3 L197 65.9 L198.5 87.2\" stroke-width=\"0.76\" opacity=\"0.74\"/>\n<path d=\"M196.5 53.7 L196.8 61.1 L198.3 75 L198.6 80.7 L198.6 87.3 L198.1 95.7\" stroke-width=\"0.67\" opacity=\"0.88\"/>\n<path d=\"M234.7 29.9 L235.1 40.3 L236.5 52.8 L237 58.3 L237 65.4 L236.3 78.1 L236.2 84.2 L236.6 89.9 L238.1 103.8 L238.3 110\" stroke-width=\"1.4\" opacity=\"0.97\"/>\n<path d=\"M232.5 37.2 L235 57 L237.1 81.4\" stroke-width=\"0.77\" opacity=\"0.72\"/>\n<path d=\"M235.5 35.1 L232 79.2 L231.4 91.1 L230.9 105.3\" stroke-width=\"0.61\" opacity=\"0.78\"/>\n<path d=\"M234.2 51.5 L234.9 59.8 L235.2 67.2 L234.8 87 L234.8 93.5 L236 109.8\" stroke-width=\"0.62\" opacity=\"0.83\"/>\n<path d=\"M234.3 45.4 L235 53 L235.3 59.8 L235.1 66.2 L234.4 80.5 L234.4 88.3\" stroke-width=\"0.71\" opacity=\"0.86\"/>\n<path d=\"M237.7 56 L234.6 87.9\" stroke-width=\"0.7\" opacity=\"0.76\"/>\n<path d=\"M237.1 48.5 L234.4 84.4\" stroke-width=\"0.66\" opacity=\"0.66\"/>\n<path d=\"M240.4 36 L243.5 35.4 L244.6 35.5 L245.3 36 L245.7 37.1 L245.6 39.4 L244.6 45 L244.4 47.5 L242.2 47.9\" stroke-width=\"1.4\" opacity=\"0.97\"/>\n<path d=\"M242.9 34.8 L244.6 35.5 L245.1 36.6 L244.5 39.4 L244.3 41.2 L244.8 47.2 L244.6 47.9 L244.1 48.3 L242.9 48.3 L241.4 48.1\" stroke-width=\"0.63\" opacity=\"0.78\"/>\n<path d=\"M245 36.7 L245.4 37.1 L245 39.4 L245.1 41.1 L246.2 45.5 L246.5 47.1\" stroke-width=\"0.65\" opacity=\"0.7\"/>\n<path d=\"M241.7 38.1 L243.7 37.8 L243.8 37.5 L243.4 36.7 L244.4 39.1 L244.9 42 L244.8 43.8 L244.4 46.3\" stroke-width=\"0.65\" opacity=\"0.89\"/>\n<path d=\"M244.2 36.5 L243.4 43.9 L243.8 46.7 L243.9 46.8 L244.3 46.6 L240.9 47.5\" stroke-width=\"0.65\" opacity=\"0.72\"/>\n<path d=\"M243.8 38.4 L243.2 40.5 L243.1 41.8 L243.3 43.5 L244.2 47.3 L240.8 46.6\" stroke-width=\"0.73\" opacity=\"0.82\"/>\n<path d=\"M245.5 39.3 L245.5 42.2 L244.9 48 L244.6 48.4\" stroke-width=\"0.62\" opacity=\"0.73\"/>\n</g>\n<g id=\"ap-streamG\">\n<path id=\"ap-st1\" class=\"stream\" d=\"\"/>\n<path id=\"ap-st2\" class=\"stream b2\" d=\"\"/>\n</g>\n<g id=\"ap-rodG\" opacity=\"0\">\n<path d=\"M-1 -176 Q1.2 -88 0.2 2\"/><path class=\"b\" d=\"M2.4 -172 Q2.8 -86 1.4 -1\"/>\n<path d=\"M-3.4 -175 Q0.8 -178.4 4.6 -174.6\"/>\n</g>\n<g id=\"ap-ripple\" opacity=\"0\"><path class=\"soft2\" d=\"M114 0 Q122 4 130 0 Q138 -4 146 0\"/></g>\n<g id=\"ap-scoopG\" opacity=\"0\">\n<path d=\"M-24 3.6 Q-14 15 -1.4 6\"/><path class=\"b\" d=\"M-22 6 Q-13 12.6 -3 6.8\"/>\n<path d=\"M-25 2.4 Q-13 -0.6 0.4 5\"/>\n<path d=\"M-0.6 4.6 Q22 -5.6 45 -16.4\"/><path class=\"b\" d=\"M1.4 7.4 Q23 -2.6 45.6 -13\"/>\n</g>\n<g id=\"ap-grounds\" opacity=\"0\">\n<path class=\"korrel\" d=\"M0 0 l1.2 2.4\"/><path class=\"korrel\" d=\"M0 0 l-1 2.2\"/>\n<path class=\"korrel\" d=\"M0 0 l1.4 2\"/><path class=\"korrel\" d=\"M0 0 l-1.2 2.4\"/>\n<path class=\"korrel\" d=\"M0 0 l1 2.2\"/><path class=\"korrel\" d=\"M0 0 l-1.4 2\"/>\n</g>\n<g id=\"ap-rmFlip\" opacity=\"0\" transform=\"translate(188 176) scale(2.6)\" style=\"stroke-width:.85\">\n<path d=\"M5.2 9.4 Q6.4 4.6 11.6 4.1 Q17 3.9 18.7 8.6\"/><path d=\"M18.9 4.6 Q19 7.6 18.8 8.9 Q16.6 9 14.4 8.7\"/>\n<path d=\"M18.8 14.6 Q17.6 19.4 12.4 19.9 Q7 20.1 5.3 15.4\"/><path d=\"M5.1 19.4 Q5 16.4 5.2 15.1 Q7.4 15 9.6 15.3\"/>\n</g>\n<g id=\"ap-rmSwirl\" opacity=\"0\" transform=\"translate(170 150) scale(1.7)\" style=\"stroke-width:1.1\">\n<path d=\"M5.2 9.4 Q6.4 4.6 11.6 4.1 Q17 3.9 18.7 8.6\"/><path d=\"M18.9 4.6 Q19 7.6 18.8 8.9 Q16.6 9 14.4 8.7\"/>\n<path d=\"M18.8 14.6 Q17.6 19.4 12.4 19.9 Q7 20.1 5.3 15.4\"/><path d=\"M5.1 19.4 Q5 16.4 5.2 15.1 Q7.4 15 9.6 15.3\"/>\n</g>\n</svg>";
/* ---------------- AeroPress-coach, normaal en omgekeerd (volledig scherm) ----------------
   Volgens docs/opzet-aeropress.html, in dezelfde opbouw als de gietcoach van
   de V60 (app/04-gietcoach.js): bovenaan de tekening, daaronder de grote
   teller met liniaal, de strook vorige / nu / straks en grote knoppen. Het
   schema komt uit de pour coach (pc.steps), dus je eigen recept, dosis en
   verhouding lopen mee. Normaal of omgekeerd volgt het recept (houding).
   Wat een stap in de tekening doet, volgt uit de soort stap; bij "wacht"
   kijken we naar de tekst (plunjer erop, lucht eruit, dop erop).          */
const AP_NAAM={bloom:'bloom',giet:'pour',swirl:'swirl',roer:'stir',wacht:'steep',keer:'flip',pers:'press',
  doorloop:'drawdown',dose:'add coffee',plunjer:'plunger in',lucht:'push out air',dop:'cap on'};

/* Alleen bij een echte AeroPress: een eigen methode die "French press" heet
   krijgt wel het AeroPress-plaatje in de kaart, maar niet deze coach.     */
function apPast(mid){
  if(typeof isAeropress!=='function'||!isAeropress(mid))return false;
  const m=methodById(mid); const naam=((m&&m.name)||'').toLowerCase();
  return mid==='aeropress'||naam.includes('aero');
}
// wat doet deze stap in de tekening?
function apActie(s){
  const k=s.k||'giet', d=String(s.d||'').toLowerCase();
  if(k==='dose')return 'dose';
  if(k!=='wacht')return k;
  if(/lucht/.test(d))return 'lucht';
  if(/\bdop\b|\bdeksel\b/.test(d))return 'dop';
  if(/plunjer|zuiger|plunger/.test(d)&&/cm|erop|erin/.test(d))return 'plunjer';
  return 'wacht';
}

const ap=(()=>{
const $=id=>document.getElementById('ap-'+id);
const RMQ=window.matchMedia?window.matchMedia('(prefers-reduced-motion: reduce)'):{matches:false};

/* ---- maten van de tekening (zie de opzet) ---- */
const CX=130, CY=212.5, FILTER=262, CUPBODEM=333, PERS_DUUR=30;
const rmp=(t,a,b)=>t<=a?0:t>=b?1:(t-a)/(b-a);
const ez=x=>x*x*(3-2*x);
const lerp=(a,b,x)=>a+(b-a)*x;
const env=(t,a,b,f)=>Math.min(rmp(t,a,a+f),1-rmp(t,b-f,b));
const klem=(x,a,b)=>Math.max(a,Math.min(b,x));
const f2=n=>n.toFixed(2);
function rot(px,py,cx,cy,deg){
  const a=deg*Math.PI/180,dx=px-cx,dy=py-cy;
  return [cx+dx*Math.cos(a)-dy*Math.sin(a), cy+dx*Math.sin(a)+dy*Math.cos(a)];
}

/* ---- toestand ---- */
let R=null, S=[], starts=[], open=false, raf=0;
let fase='klaar', pauzeVan='loopt';
let t=0, speed=1, stem=false, gezegd={}, eindT=null, eindOp=null, terug=false, vorigeCur=-1, cache={};
try{stem=localStorage.getItem('scc_gc_stem')==='1';}catch(e){}

function bouw(){
  const r=recipeById(pc.rid)||{};
  const dose=parseFloat(document.getElementById('f-dose').value)||r.dose||15;
  const temp=document.getElementById('f-temp').value||r.temp||'';
  const maling=(document.getElementById('f-grind').value||r.maling||'').trim();
  const water=pc.steps.length?(pc.steps[pc.steps.length-1].water||0):0;
  const om=r.houding==='omgekeerd';
  S=pc.steps.map(x=>({t:+x.t||0,k:x.k||'giet',d:x.d||'',g:x.g?Math.round(+x.g):0,actie:apActie(x)}));
  const pi=S.findIndex(s=>s.k==='pers');
  const ki=om?S.findIndex(s=>s.k==='keer'):-1;
  // water in de kamer (voor het drukken) en wat er in de kop komt (erna)
  let wk=0, vorige=0;
  S.forEach((s,j)=>{if(s.g&&(pi<0||j<pi)){s.na=false;s.van=vorige;s.a=Math.max(0,s.g-vorige);vorige=Math.max(vorige,s.g);wk=vorige;}});
  const uit=Math.max(0,Math.round(wk-1.4*dose));          // gemalen koffie houdt water vast
  let kop=uit, eerstNa=-1;
  S.forEach((s,j)=>{if(s.g&&pi>=0&&j>pi){s.na=true;if(eerstNa<0)eerstNa=j;s.van=kop;s.a=Math.max(0,s.g-kop);kop=Math.max(kop,s.g);}});
  S.forEach((s,j)=>{
    if(!s.g)return;
    s.lift=(j===eerstNa)?1.2:0;          // eerst de AeroPress eraf, dan aanvullen
    const gat=(S[j+1]?S[j+1].t:Infinity)-s.t-s.lift;
    s.dur=Math.max(3,Math.min(gat,s.a/GC_TEMPO));
  });
  const perg=wk>0?Math.min(0.5,104/wk):0.5;
  R={naam:r.naam||'AeroPress',om,dose,temp,maling,water,pi,ki,eerstNa,wk,uit,perg,
     cupg:Math.min(0.3,56/Math.max(1,kop,uit)),
     pj:S.findIndex((s,j)=>s.actie==='plunjer'&&(pi<0||j<pi)),
     lj:S.findIndex(s=>s.actie==='lucht'), dj:S.findIndex(s=>s.actie==='dop'),
     seal0:Math.min(212,FILTER-wk*perg)};
  R.sealIn=Math.min(151,FILTER-wk*perg-6);
  zet('naam',esc(R.naam));
  reset();
}
function reset(){
  fase='klaar'; t=0; gezegd={}; eindT=null; eindOp=null; vorigeCur=-1; terug=false;
  starts=S.map(x=>x.t);
  BrewStem.stil();
  wakeUit(); linBouw();
}

/* ---- de klok ---- */
function cur(){let i=0;for(let j=0;j<S.length;j++)if(t>=starts[j])i=j;return i;}
function w0(j){return starts[j]+(S[j].lift||0);}
function w1(j){return w0(j)+S[j].dur;}
function stapEind(j){return j<S.length-1?starts[j+1]:Infinity;}
function flipOp(){
  if(!R.om)return Infinity;
  if(R.ki>=0)return starts[R.ki];
  return R.pi>=0?starts[R.pi]:Infinity;
}
// het omdraaien zelf: eerst (zonder dop-stap) de dop erop, dan daalt de kop, dan draait alles
function flipBasis(){return flipOp()+(R.dj>=0?0:0.8);}
function persBegin(){
  if(R.pi<0)return Infinity;
  let b=starts[R.pi];
  if(R.om)b=Math.max(b,flipBasis()+3);
  else if(R.pj<0)b+=1.5;                 // de plunjer moet er eerst op
  return b;
}
function persEind(){
  if(R.pi<0)return Infinity;
  const e=stapEind(R.pi);
  return isFinite(e)?Math.max(e,persBegin()+3):persBegin()+PERS_DUUR;
}
function eindVerwacht(){
  const l=S.length-1, s=S[l];
  if(s.g)return w1(l)+2;
  if(s.k==='pers')return persEind();
  if(s.k==='keer')return starts[l]+6;
  return starts[l]+(s.k==='swirl'||s.k==='roer'?5:10);
}
function fmt(s){s=Math.max(0,Math.floor(s+1e-6));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0');}
const fmtIn=s=>fmt(Math.ceil(Math.max(0,s)-1e-6));

/* ---- de stand van de tekening op tijd tt ----
   Assenstelsel: de AeroPress rechtop op de kop. Omgekeerd is datzelfde
   plaatje 180 graden gedraaid rond (130, 212.5); omdraaien is die hoek naar
   360. Water in de kamer is een rechthoek tussen top en bot.              */
function scene(tt){
  const RM=RMQ.matches;
  const ov=(a,b)=>RM?(tt>=a?1:0):ez(rmp(tt,a,b));
  const Z={theta:0,cupD:0,cupA:1,lift:0,pressA:1,swA:0,swX:0,tilt:0,off:0,capOff:0,capA:1,capW:0,
    seal:91,plA:0,top:FILTER,bot:FILTER,crTop:false,crBot:false,bedY:261,bedS:1,cupG:0,
    kShow:0,kTilt:0,pour:false,pourY:0,drip:false,rodA:0,rodX:CX,rodY:195,rodR:7,rip:0,ripX:0,ripY:0,
    scA:0,scR:0,grA:0,grPh:0,rmFlip:0,rmSwirl:0};
  // water in de kamer, tot nu toe gegoten
  let gK=0;
  S.forEach((s,j)=>{if(s.g&&!s.na)gK+=s.a*rmp(tt,w0(j),w1(j));});
  const L=gK*R.perg;
  const pb=persBegin(), pe_=persEind();
  const p=rmp(tt,pb,pe_), pe=0.7*p+0.3*ez(p);
  let opp;                                    // het wateroppervlak, in schermcoordinaten
  if(!R.om){
    const niveau=FILTER-L;
    if(R.pj>=0){
      const a=starts[R.pj]+0.6, ins=ov(a,a+3);
      Z.plA=RM?(tt>=a?1:0):ins; Z.seal=lerp(91,R.sealIn,ins);
    }
    if(R.pi>=0&&tt>=starts[R.pi]&&R.pj<0){
      const ins=ov(starts[R.pi],starts[R.pi]+1.5);
      Z.plA=RM?1:ins; Z.seal=lerp(91,R.sealIn,ins);
    }
    if(tt>=pb)Z.seal=lerp(R.sealIn,250,pe);
    Z.top=Math.max(niveau,Z.seal); Z.bot=FILTER;
    if(L<=0)Z.top=Z.bot;
    Z.crTop=(L>4&&Z.seal<niveau);
    if(tt>=pb)Z.cupG=R.uit*klem((Z.seal-niveau)/Math.max(1,250-niveau),0,1);
    Z.drip=tt>pb&&tt<pe_+1&&Z.seal>niveau;
    Z.bedS=1-0.45*p;
    opp=niveau;
  }else{
    const fb=flipBasis();
    if(RM){
      Z.theta=tt<fb+1.8?180:360; Z.cupA=tt>=fb?1:0;
      Z.rmFlip=(tt>=fb&&tt<fb+3)?1:0;
    }else{
      Z.theta=180+180*ez(rmp(tt,fb+1,fb+2.8));
      Z.cupD=70*(1-ez(rmp(tt,fb,fb+0.9)));
      Z.cupA=tt<fb?0:rmp(tt,fb,fb+0.5);
    }
    // lucht eruit: de kamer zakt over de plunjer
    let la, lb;
    if(R.lj>=0){la=starts[R.lj];lb=Math.min(la+6,stapEind(R.lj));}
    else if(R.dj>=0){la=starts[R.dj];lb=la+0.8;}
    else{la=flipOp();lb=la+0.7;}
    Z.off=58*(1-ov(la,Math.max(la+0.1,lb)));
    // de dop
    const ca=R.dj>=0?starts[R.dj]:flipOp(), cb=ca+(R.dj>=0?2.4:0.7);
    Z.capOff=46*(1-ov(ca,cb));
    Z.capA=tt<ca?0:(RM?1:rmp(tt,ca,ca+0.6));
    if(!RM&&tt>cb&&tt<cb+1.6)Z.capW=5*Math.sin(2*Math.PI*(tt-cb)/0.8)*(1-rmp(tt,cb,cb+1.6));
    Z.plA=1;
    Z.seal=tt>=pb?lerp(R.seal0,250,pe):R.seal0;
    Z.top=Z.seal; Z.bot=R.seal0+L;
    if(L<=0)Z.bot=Z.top;
    Z.crBot=(L>4&&Z.off>2);
    // het maalsel: eerst op de plunjer, na het draaien zakt het op het filter
    const z=ov(fb+2.9,fb+4.4);
    Z.bedY=lerp(R.seal0,261,z);
    Z.bedS=lerp(-1,1,z)*(1-0.45*p);
    if(tt>=pb)Z.cupG=R.uit*p;
    Z.drip=tt>pb+0.4&&tt<pe_;
    opp=2*CY-(R.seal0+L);
  }
  // na het drukken: AeroPress eraf en aanvullen in de kop
  if(R.eerstNa>=0){
    const a=starts[R.eerstNa];
    Z.lift=150*ov(a,a+1.5);
    Z.pressA=1-rmp(tt,a+0.4,a+1.5);
    if(tt>=a)Z.cupG=R.uit;
    S.forEach((s,j)=>{if(s.g&&s.na)Z.cupG+=s.a*rmp(tt,w0(j),w1(j));});
  }
  // de ketel: hij komt erbij voor een giet en gaat daarna weer weg
  S.forEach((s,j)=>{
    if(!s.g)return;
    const a=w0(j), b=w1(j);
    const show=RM?((tt>=a-0.8&&tt<b+0.8)?1:0):ez(Math.max(0,env(tt,a-0.8,b+0.8,0.8)));
    if(show>Z.kShow){Z.kShow=show;Z.kNa=!!s.na;}
    const tilt=RM?((tt>=a&&tt<b)?1:0):ez(Math.max(0,env(tt,a-0.5,b,0.5)));
    if(tilt>Z.kTilt)Z.kTilt=tilt;
    if(tt>a&&tt<b){Z.pour=true;Z.pourY=s.na?(CUPBODEM-Z.cupG*R.cupg):opp;}
  });
  // swirlen, roeren en de laatste koffie erbij
  S.forEach((s,j)=>{
    const a=starts[j], b=Math.min(a+5,stapEind(j));
    if(tt<a||tt>=b)return;
    if(s.k==='swirl'){
      const e=Math.sin(Math.PI*rmp(tt,a,b));
      if(!RM){Z.swA=e*3.2*Math.sin(2*Math.PI*(tt-a)/1.3);Z.swX=e*2*Math.cos(2*Math.PI*(tt-a)/1.3);Z.tilt=-Z.swA*1.9;}
      else Z.rmSwirl=1;
    }else if(s.k==='roer'){
      const ph=2*Math.PI*(tt-a)/0.9;
      Z.rodA=RM?1:env(tt,a,b,0.4);
      Z.rodX=RM?CX:CX+13*Math.sin(ph);
      Z.rodR=RM?8:7+3*Math.sin(ph+0.8);
      Z.rodY=Math.min(250,opp+32);
      Z.rip=RM?0:Z.rodA; Z.ripX=RM?0:4*Math.sin(ph); Z.ripY=opp;
    }else if(s.actie==='dose'){
      Z.scA=RM?1:env(tt,a,b,0.5);
      Z.scR=RM?-38:-38*ez(rmp(tt,a+0.6,a+1.6));
      Z.grA=(tt>a+1.4&&tt<b-1)?1:0;
      Z.grPh=(tt-a-1.4)/0.9;
    }
  });
  return Z;
}

/* ---- tekenen ---- */
let el=null, korrels=[];
function teken(Z){
  if(!el){
    el={};
    ['G','cupG','cupLiq','cupCr','pressG','bedG','chM','liqT','chLiq','chCr','capG','plG','drip',
     'kettle','st1','st2','rodG','ripple','scoopG','grounds','rmFlip','rmSwirl','tek'].forEach(k=>el[k]=$(k));
    korrels=[...el.grounds.querySelectorAll('path')];
  }
  el.G.setAttribute('transform','rotate('+f2(Z.theta)+' '+CX+' '+CY+')');
  el.cupG.setAttribute('transform','translate(0 '+f2(Z.cupD)+')');
  el.cupG.setAttribute('opacity',Z.cupA);
  el.pressG.setAttribute('transform','translate('+f2(Z.swX)+' '+f2(-Z.lift)+') rotate('+f2(Z.swA)+' 130 262)');
  el.pressG.setAttribute('opacity',Z.pressA);
  el.chM.setAttribute('transform','translate(0 '+f2(Z.off)+')');
  const h=Math.max(0,Z.bot-Z.top);
  el.chLiq.setAttribute('y',f2(Z.top-Z.off)); el.chLiq.setAttribute('height',f2(h));
  if(Z.crTop&&h>0){el.chCr.setAttribute('y',f2(Z.top-Z.off));el.chCr.setAttribute('height',3);}
  else if(Z.crBot&&h>0){el.chCr.setAttribute('y',f2(Z.bot-Z.off-3));el.chCr.setAttribute('height',3);}
  else el.chCr.setAttribute('height',0);
  el.liqT.setAttribute('transform','rotate('+f2(Z.tilt)+' 130 '+f2(Z.top-Z.off)+')');
  el.capG.setAttribute('transform','translate(0 '+f2(Z.capOff)+') rotate('+f2(Z.capW)+' 130 266)');
  el.capG.setAttribute('opacity',Z.capA);
  el.plG.setAttribute('transform','translate(0 '+f2(Z.seal)+')');
  el.plG.setAttribute('opacity',Z.plA);
  el.bedG.setAttribute('transform','translate(0 '+f2(Z.bedY)+') scale(1 '+Z.bedS.toFixed(3)+')');
  const ch=Z.cupG*R.cupg, cy=CUPBODEM-ch;
  el.cupLiq.setAttribute('y',f2(cy)); el.cupLiq.setAttribute('height',f2(ch));
  el.cupCr.setAttribute('y',f2(cy)); el.cupCr.setAttribute('height',Z.cupG>3?2.6:0);
  const RM=RMQ.matches;
  const kt=-22*Z.kTilt, kx=(RM?(Z.kShow>0.5?0:70):(1-Z.kShow)*70);
  // omgekeerd staat de rand van de kamer hoger: dan giet de kan 32 hoger, anders gaat de tuit door de rand
  const ky=(R.om&&!Z.kNa)?-32:0;
  el.kettle.setAttribute('transform','translate('+f2(kx)+' '+ky+') rotate('+f2(kt)+' 262 57)');
  el.kettle.setAttribute('opacity',RM?(Z.kShow>0.5?1:0):Z.kShow);
  if(Z.pour){
    const [tx,ty]=rot(134,35,262,57,kt);
    const x=tx+kx, y0=ty+ky, my=(y0+Z.pourY)/2;
    el.st1.setAttribute('d','M'+x.toFixed(1)+' '+y0.toFixed(1)+' Q'+(x-0.6).toFixed(1)+' '+my.toFixed(1)+' 130 '+Z.pourY.toFixed(1));
    el.st2.setAttribute('d','M'+(x+2.2).toFixed(1)+' '+(y0+3).toFixed(1)+' Q'+(x+1.6).toFixed(1)+' '+my.toFixed(1)+' 131.4 '+(Z.pourY-2).toFixed(1));
  }else{el.st1.setAttribute('d','');el.st2.setAttribute('d','');}
  el.drip.setAttribute('d',Z.drip?('M130 272 Q130.8 '+((272+cy)/2).toFixed(1)+' 130 '+cy.toFixed(1)):'');
  el.rodG.setAttribute('opacity',Z.rodA);
  el.rodG.setAttribute('transform','translate('+f2(Z.rodX)+' '+f2(Z.rodY)+') rotate('+f2(Z.rodR)+')');
  el.ripple.setAttribute('opacity',Z.rip*0.9);
  el.ripple.setAttribute('transform','translate('+f2(Z.ripX)+' '+f2(Z.ripY)+')');
  el.scoopG.setAttribute('opacity',Z.scA);
  el.scoopG.setAttribute('transform','translate(156 70) rotate('+f2(Z.scR)+')');
  el.grounds.setAttribute('opacity',Z.grA);
  korrels.forEach((k,i)=>{
    const f=((Z.grPh+i/6)%1+1)%1;
    k.setAttribute('transform','translate('+(126+(i%3)*4)+' '+(88+f*70).toFixed(1)+')');
  });
  el.rmFlip.setAttribute('opacity',Z.rmFlip);
  el.rmSwirl.setAttribute('opacity',Z.rmSwirl);
  el.tek.classList.toggle('stil',fase!=='loopt');
  el.tek.style.setProperty('--snel',speed);
}

/* ---- de knoppen ---- */
function start(){
  if(fase==='af')reset();
  fase='aftel'; t=-GC_VOORAF; gezegd={}; vorigeCur=-1;
  zeg(tekstVooraf(0)); gezegd.v0=true;     // in de tik zelf, anders praat een iPhone niet
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
  starts[i+1]=t;
  for(let k=i+2;k<S.length;k++)starts[k]=starts[k-1]+(S[k].t-S[k-1].t);
  for(let m=i+1;m<S.length;m++){delete gezegd['v'+m];delete gezegd['n'+m];}
  gezegd['v'+(i+1)]='overgeslagen';
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
// wat de klok zag landt in het formulier, net als bij de gewone klok
function naarFormulier(){
  if(terug)return; terug=true;
  pc.marks=S.map((s,j)=>(isFinite(starts[j])&&starts[j]<=eindT)?Math.round(starts[j]*10)/10:null);
  pc.total=Math.round(eindT);
  // een AeroPress heeft geen doorlooptijd: dat veld blijft leeg (anders
  // denkt de dial-in hulp dat het bed vastloopt)
  pc.draw=null;
  pc.el=eindT; pc.run=false;
  pourFill(); setVal('f-draw','');
  pcOpen.log=true; pcOpen.pour=false;
  const b=document.getElementById('pc-btn'); if(b)b.textContent='start again';
  pourSteps(); renderCards();
}

/* ---- hardop zeggen (zelfde stem en knop als de gietcoach) ---- */
function zeg(tekst){
  if(!stem||!tekst)return;
  toonZegt(tekst);
  BrewStem.zeg(tekst);      // ElevenLabs met eigen sleutel, anders de stem van de telefoon
}
let zegtT=0;
function toonZegt(tekst){
  const e=$('zegt'); e.querySelector('span').textContent='“'+tekst+'”';
  e.classList.add('op'); clearTimeout(zegtT);
  zegtT=setTimeout(()=>e.classList.remove('op'),3400);
}
function zin(d){
  const x=String(d).replace(/\s*[—;]\s*/g,', ').replace(/×/g,' keer ')
    .replace(/(\d+):(\d\d)/g,'$1 minuut $2').replace(/\s+/g,' ').trim();
  return x?(x.charAt(0).toUpperCase()+x.slice(1)+'.'):'';
}
const KORT={swirl:'Swirlen.',roer:'Roeren.',wacht:'Laten trekken.',keer:'Kop erop, en omdraaien.',pers:'Drukken, rustig.',
  dose:'Koffie erbij.',plunjer:'Plunjer erop.',lucht:'Lucht eruit.',dop:'Dop erop.',doorloop:'Laten zakken.'};
const VOORAF={swirl:'swirlen',roer:'roeren',wacht:'laten trekken',keer:'omdraaien',pers:'drukken',dose:'koffie erbij',
  plunjer:'plunjer erop',lucht:'lucht eruit',dop:'dop erop',doorloop:'laten zakken'};
// alle zinnen die de stem in dit recept kan zeggen, in volgorde
function stemZinnen(){
  const l=[];
  for(let j=0;j<S.length;j++)l.push(tekstVooraf(j),tekstNu(j,true));
  for(let j=0;j<S.length;j++)l.push(tekstNu(j,false));
  return l.concat(['Klaar. Tik op klaar en proef.','Klaar.']);
}
function tekstVooraf(j){
  const s=S[j];
  if(s.g)return 'Over drie tellen '+(s.na?'aanvullen ':'')+'naar '+s.g+' gram.';
  return 'Over drie tellen: '+(VOORAF[s.actie]||s.actie)+'.';
}
function tekstNu(j,vooraf){
  const s=S[j];
  if(speed!==1||vooraf==='kort'){
    if(s.g)return 'Naar '+s.g+' gram.';
    return KORT[s.actie]||'';
  }
  if(s.g)return vooraf===true?'Nu.':('Nu: naar '+s.g+' gram.');
  if(s.k==='keer'||s.k==='pers')return KORT[s.k];
  return zin(s.d);
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
  if(eindOp!=null&&!gezegd.eind){gezegd.eind=true;zeg('Klaar. Tik op klaar en proef.');}
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
  const e=$('toast'); e.textContent=m; e.classList.add('op');
  clearTimeout(meldT); meldT=setTimeout(()=>e.classList.remove('op'),2800);
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
    if(s.g||s.k==='pers'){const e=document.createElement('i');e.className='lin-giet';lin.insertBefore(e,$('lin-nu'));linEls.push({e,j,giet:true});}
    if(j>0){const b=document.createElement('b');b.className='lin-tik';lin.insertBefore(b,$('lin-nu'));linEls.push({e:b,j,giet:false});}
  });
}
function blok(j){return S[j].k==='pers'?[persBegin(),persEind()]:[w0(j),w1(j)];}
function linUpdate(){
  const span=fase==='af'?Math.max(eindT,1):Math.max(eindVerwacht(),Math.max(0,t)+3);
  const nu=fase==='af'?eindT:Math.max(0,t);
  linEls.forEach(o=>{
    if(o.giet){
      const [a,b]=blok(o.j);
      o.e.style.left=(a/span*100)+'%';
      o.e.style.width=Math.max(1.2,(b-a)/span*100)+'%';
      o.e.classList.toggle('gedaan',nu>=b);
    }else{o.e.style.left=(starts[o.j]/span*100)+'%';o.e.classList.toggle('gedaan',nu>=starts[o.j]);}
  });
  const p=Math.min(100,nu/span*100);
  $('lin-nu').style.left=p+'%'; $('lin-ged').style.width=p+'%';
  zet('lin-eind',fase==='af'?fmt(eindT):'~'+fmt(eindVerwacht()));
}

/* ---- de woorden op het scherm ---- */
function zet(id,html){if(cache[id]!==html){cache[id]=html;$(id).innerHTML=html;}}
function label(s){
  if(s.g)return (s.na?'top up to ':'pour to ')+s.g+' g';
  return esc(AP_NAAM[s.actie]||s.actie);
}
function doelVan(i){
  const s=S[i];
  if(s.g)return [s.g+' g',''];
  if(s.k==='pers')return [R.uit?('~'+R.uit+' g'):('~'+PERS_DUUR+' s'),''];
  if(s.k==='keer')return ['now',''];
  if(s.k==='swirl'||s.k==='roer')return ['5 s','stil'];
  if(s.actie==='dose'){const m=String(s.d).match(/(\d+(?:[.,]\d+)?)\s*g\b/);return [m?(m[1]+' g'):'','stil'];}
  if(s.actie==='plunjer')return ['~1 cm','stil'];
  if(s.actie==='wacht'&&i<S.length-1)return ['until '+fmt(starts[i+1]),'lang'];
  return ['',''];
}
function grootGetal(txt){
  return txt.split('').map(ch=>ch===':'?'<span class="dp">:</span>':'<span class="c">'+ch+'</span>').join('');
}
function render(){
  const i=cur(), s=S[i], bezig=(fase==='loopt'||fase==='pauze'||fase==='aftel');
  const tel=(t<0&&bezig);
  zet('tijd',grootGetal(tel?String(Math.max(1,Math.ceil(-t-1e-6))):fmt(fase==='af'?eindT:Math.max(0,t))));
  $('tijd').classList.toggle('tel',tel);
  linUpdate();

  zet('info-l',esc([R.om?'inverted':'regular',R.dose+' g',R.water+' g water',R.temp?(R.temp+' °C'):'',R.maling].filter(Boolean).join(' · ')));
  const wk=bezig&&fase!=='pauze'?(wakeStatus==='aan'?'screen stays on':(wakeStatus?'screen may dim':'')):'';
  zet('info-r',[wk,speed>1?speed+'× demo':''].filter(Boolean).join(' · '));

  // vorige
  const prep=R.om?('upside down on the plunger, paper rinsed, '+R.dose+' g in'):('paper in the cap, on your cup, '+R.dose+' g in');
  let v;
  if(fase==='klaar')v='<span class="tt">before</span><span class="v-wat">'+prep+'</span>';
  else if(fase==='af')v='<span class="tt">'+fmt(starts[i])+'</span>'+GC_VINK+'<s>'+label(S[i])+'</s>';
  else if(i===0)v='<span class="tt">before</span>'+GC_VINK+'<s>'+prep+'</s>';
  else v='<span class="tt">'+fmt(starts[i-1])+'</span>'+GC_VINK+'<s>'+label(S[i-1])+'</s>';
  zet('r-vorige',v);

  // nu
  let wat, doel='', dcls='', d, balk=0, tl='', tr='', keer=false;
  if(fase==='af'){
    wat='done'; doel=fmt(eindT); d='Taste it. The times are in your brew below.'; balk=1;
  }else{
    wat=s.g?(s.na?'top up to':'pour to'):esc(AP_NAAM[s.actie]||s.actie);
    [doel,dcls]=doelVan(i);
    keer=s.k==='keer'&&t>=0&&fase!=='klaar';
    d=(s.k==='keer'?PIJL_OM:'')+esc(s.d);
    if(fase==='klaar')tl=S[0].g?'tap start, then pick up the kettle':'tap start';
    else if(t<0)tl=S[0].g?'pick up the kettle':'get ready';
    else if(eindOp!=null){balk=1;tl='all done — tap done';}
    else if(s.g){
      const f=klem((t-w0(i))/s.dur,0,1); balk=f;
      if(t<w0(i))tl='lift the AeroPress off the cup';
      else if(f<1){tl='~'+Math.round(s.van+s.a*f)+' g by now';tr=fmtIn(w1(i)-t)+' left';}
      else tl='at '+s.g+' g, '+(s.na?'taste it':'let it steep');
    }else if(s.k==='pers'){
      const a=persBegin(), b=persEind(); balk=klem((t-a)/Math.max(1,b-a),0,1);
      if(t<a)tl=R.om?'turning over…':'plunger on first';
      else{tl='slow and steady, all the way';tr=fmtIn(b-t)+' left';}
    }else if(s.k==='keer'){
      balk=klem((t-starts[i])/3,0,1); tl='hold cup and chamber together';
    }else{
      const e=i<S.length-1?starts[i+1]:eindVerwacht();
      balk=klem((t-starts[i])/Math.max(1,e-starts[i]),0,1);
      tl={swirl:'a few gentle turns',roer:'one side of the stick',dose:'sprinkle it on top',lucht:'slowly, until the coffee reaches the top',dop:'twist it tight'}[s.actie]||'hands off';
      if(i<S.length-1)tr=fmtIn(starts[i+1]-t)+' left';
    }
  }
  zet('r-nu','<div class="nu-kop"><span class="nu-wat">'+wat+'</span><span class="nu-doel '+dcls+'">'+doel+'</span></div>'+
    '<div class="nu-d">'+d+'</div><div class="nu-balk"><i style="width:'+(balk*100).toFixed(1)+'%"></i></div>'+
    '<div class="nu-tempo"><span>'+tl+'</span><span>'+tr+'</span></div>');
  $('r-nu').classList.toggle('keer',keer);
  const sleutel=fase==='af'?'af':i;
  if(sleutel!==vorigeCur){
    if(vorigeCur!==-1&&!RMQ.matches){const nu=$('r-nu');nu.classList.remove('land');void nu.offsetWidth;nu.classList.add('land');}
    vorigeCur=sleutel;
  }

  // straks
  let n, bijna=false;
  if(fase==='af')n='<span class="n-lbl">next</span><span class="n-wat">taste it, then log the brew</span>';
  else if(i<S.length-1){
    const over=starts[i+1]-Math.max(0,t);
    bijna=(fase==='loopt'||fase==='pauze')&&over<=GC_VOORAF;
    n='<span class="n-lbl">next</span><span class="n-wat">'+label(S[i+1])+'</span><span class="n-in">in '+fmtIn(over)+'</span>';
  }else n='<span class="n-lbl">next</span><span class="n-wat">'+(eindOp!=null?'tap done':'tap done when you are done')+'</span>';
  zet('r-volg',n);
  $('r-volg').classList.toggle('bijna',bijna);

  zet('b-start',{klaar:'start',aftel:'pause',loopt:'pause',pauze:'resume',af:'log it'}[fase]);
  const bv=$('b-volg');
  bv.disabled=(fase==='klaar'||fase==='af');
  zet('b-volg',(!bv.disabled&&t>=0&&i===S.length-1)?'done':'next step');
  bv.classList.toggle('nadruk',eindOp!=null&&fase!=='af');
  const bs=$('b-stem');
  zet('b-stem',(stem?GC_STEM_AAN:GC_STEM_UIT)+'<span>'+(stem?'voice on':'voice off')+'</span>');
  bs.classList.toggle('aan',stem); bs.setAttribute('aria-pressed',stem?'true':'false');
}

/* ---- de lus: alleen zolang de coach open is ---- */
let last=0;
function frame(now){
  if(!open){raf=0;return;}
  const ruw=Math.max(0,(now-last)/1000); last=now;
  if(fase==='aftel'||fase==='loopt'){
    t+=ruw*speed;
    if(fase==='aftel'&&t>=0)fase='loopt';
  }
  if((fase==='loopt'||fase==='pauze')&&eindOp==null&&cur()===S.length-1&&t>=eindVerwacht())eindOp=t;
  stemCheck();
  teken(scene(fase==='klaar'?-1:(fase==='af'?eindT:t)));
  render();
  raf=requestAnimationFrame(frame);
}

/* ---- openen en sluiten ---- */
function maak(){
  if(document.getElementById('apcoach'))return;
  const e=document.createElement('div');
  e.id='apcoach'; e.className='gc'; e.hidden=true;
  e.setAttribute('role','dialog'); e.setAttribute('aria-modal','true'); e.setAttribute('aria-label','AeroPress coach');
  e.innerHTML=
    '<div class="gc-top"><div class="gc-naam" id="ap-naam"></div>'+
    '<button type="button" class="ik rand" id="ap-b-dicht" aria-label="close">'+GC_KRUIS+'</button></div>'+
    '<div class="gc-info"><span id="ap-info-l"></span><span class="r" id="ap-info-r"></span></div>'+
    '<div class="gc-tek">'+AP_TEKENING+
      '<div class="gc-zegt rand" id="ap-zegt" aria-hidden="true">'+GC_STEM_AAN+'<span></span></div></div>'+
    '<div class="gc-klok"><div class="gc-tijd" id="ap-tijd" aria-live="off"></div>'+
      '<div class="lin-rij"><span>0:00</span><div class="lin" id="ap-lin"><div class="lin-as"></div>'+
      '<div class="lin-ged" id="ap-lin-ged"></div><div class="lin-nu" id="ap-lin-nu"></div></div>'+
      '<span id="ap-lin-eind"></span></div></div>'+
    '<div class="gc-strook"><div class="r-vorige" id="ap-r-vorige"></div>'+
      '<div class="r-nu rand" id="ap-r-nu"></div><div class="r-volg rand" id="ap-r-volg"></div></div>'+
    '<div class="gc-knoppen">'+
      '<button type="button" class="kn kn-stem rand" id="ap-b-stem" aria-pressed="false"></button>'+
      '<button type="button" class="kn kn-start rand" id="ap-b-start">start</button>'+
      '<button type="button" class="kn kn-volg rand" id="ap-b-volg" disabled>next step</button></div>'+
    '<div class="gc-toast rand" id="ap-toast" role="status"></div>';
  document.body.appendChild(e);
  el=null;
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
  const e=document.getElementById('apcoach');
  e.hidden=false; document.body.classList.add('gc-open'); open=true;
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
  const e=document.getElementById('apcoach'); if(e)e.hidden=true;
  document.body.classList.remove('gc-open');
  if(raf){cancelAnimationFrame(raf);raf=0;}
}
return {openen,sluit,isOpen:()=>open,snelheid:n=>{speed=n>1?n:1;},
  stand:()=>({fase,t,eindT,eindOp,cur:cur(),starts:starts.slice(),om:R&&R.om,uit:R&&R.uit,eind:R?eindVerwacht():null,
    S:S.map(x=>({t:x.t,g:x.g,k:x.k,actie:x.actie,dur:x.dur,na:!!x.na,van:x.van}))}),
  scene:tt=>scene(tt)};
})();
function apOpen(){ap.openen();}
