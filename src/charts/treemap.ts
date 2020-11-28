const treemap: string = `
<?xml version="1.0" encoding="UTF-8"?>
<svg width="240px" height="200px" viewBox="0 0 240 200" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<!--Author: Plothis Studio - for Gradict - http://tuzhidian.com-->
  <defs>
    <style title="palette" type="text/css">
      <![CDATA[
        .color-theme-01 {
          fill: #343e73;
        }
        .color-theme-02 {
          fill: #22a6a1;
        }
        .color-theme-03 {
          fill: #fa581f;
        }
        .color-theme-04 {
          fill: #ff9c4d;
        }
        .color-theme-05 {
          fill: #a6d169;
        }
        .color-theme-06 {
          fill: #ffda8a;
        }
        .color-theme-07 {
          fill: #e0b8ed;
        }
        .color-theme-08 {
          fill: #d0215a;
        }
        .color-assist-bg {
          fill: #ffffff;
        }
      ]]>
    </style>
  </defs>
  <title>
    Treemap
  </title>
  <g id="Treemap" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
    <rect id="bg" class="color-assist-bg" fill-rule="nonzero" x="0" y="0" width="240" height="200"/>
    <g id="graphic" transform="translate(51.000000, 53.000000)" fill-rule="nonzero">
      <rect id="Rectangle-08" class="color-theme-08" x="122" y="65" width="16" height="29"/>
      <rect id="Rectangle-07" class="color-theme-07" x="100" y="65" width="22" height="29"/>
      <rect id="Rectangle-06" class="color-theme-06" x="100" y="42" width="38" height="23"/>
      <rect id="Rectangle-05" class="color-theme-05" x="70" y="42" width="30" height="52"/>
      <rect id="Rectangle-04" class="color-theme-04" x="108" y="0" width="30" height="42"/>
      <rect id="Rectangle-03" class="color-theme-03" x="70" y="0" width="38" height="42"/>
      <rect id="Rectangle-02" class="color-theme-02" x="0" y="52" width="70" height="42"/>
      <rect id="Rectangle-01" class="color-theme-01" x="0" y="0" width="70" height="52"/>
    </g>
  </g>
</svg>
`;

const Treemap = {
  name: 'Treemap',
  svgCode: treemap,
};

export default Treemap;
