import * as fse from 'fs-extra';
import * as path from 'path';
import * as SVGO from 'svgo';

const svgo = new SVGO({
  plugins: [
    {
      cleanupAttrs: true,
    },
    {
      removeDoctype: true,
    },
    {
      removeXMLProcInst: true,
    },
    {
      removeComments: true,
    },
    {
      removeMetadata: true,
    },
    {
      removeTitle: true,
    },
    {
      removeDesc: true,
    },
    {
      removeUselessDefs: true,
    },
    {
      removeEditorsNSData: true,
    },
    {
      removeEmptyAttrs: true,
    },
    {
      removeHiddenElems: true,
    },
    {
      removeEmptyText: true,
    },
    {
      removeEmptyContainers: true,
    },
    {
      removeViewBox: false,
    },
    {
      cleanupEnableBackground: true,
    },
    {
      convertStyleToAttrs: true,
    },
    {
      convertColors: true,
    },
    {
      convertPathData: true,
    },
    {
      convertTransform: true,
    },
    {
      removeUnknownsAndDefaults: true,
    },
    {
      removeNonInheritableGroupAttrs: true,
    },
    {
      removeUselessStrokeAndFill: true,
    },
    {
      removeUnusedNS: true,
    },
    {
      cleanupIDs: true,
    },
    {
      cleanupNumericValues: true,
    },
    {
      moveElemsAttrsToGroup: true,
    },
    {
      moveGroupAttrsToElems: true,
    },
    {
      collapseGroups: true,
    },
    {
      removeRasterImages: false,
    },
    {
      mergePaths: true,
    },
    {
      convertShapeToPath: true,
    },
    {
      sortAttrs: true,
    },
    {
      removeDimensions: true,
    },
    {
      removeAttrs: { attrs: '(stroke|fill)' },
    },
  ],
});

const extractSVGs = async () => {
  const SVG_PATH = 'svgs/';
  const TS_PATH = 'src/charts/';

  const files = await fse.readdir(SVG_PATH);
  console.log(files.toString());

  const filePath = path.join(process.cwd(), SVG_PATH, files[1]);

  const data = await fse.readFile(filePath, { encoding: 'utf8' });
  console.log(data);

  console.log('===========');

  const result = await svgo.optimize(data);
  console.log(result);

  const tsPath = path.join(process.cwd(), TS_PATH, `${path.basename(files[1], path.extname(files[1]))}.ts`);

  await fse.writeFile(tsPath, result.data);
};

(async () => {
  await extractSVGs();
})();
