import * as fse from 'fs-extra';
import * as path from 'path';
import * as readline from 'readline';
import * as SVGO from 'svgo';
import { CHART_ID_OPTIONS, ChartID } from '@antv/knowledge';
import { SVGO_SETTINGS } from './svgo-settings';

interface IChartInfo {
  name: string;
  svgCode: string;
}

interface IChartBaseRecord {
  svgFileName?: string;
  svgFilePath?: string;
  tsFileName?: string;
  tsFilePath?: string;
  chartId?: string;
  chartName?: string;
  svgCode?: string;
}

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

const svgo: SVGO = new SVGO(SVGO_SETTINGS);

const fileTemplate = ({ name, svgCode }: IChartInfo) => `// ${name}

const ${name} = {
  name: '${name}',
  svgCode: '${svgCode}'
};

export default ${name};
`;

/**
 * Extract svg images from `svgs/`, optimize svg codes
 * and then generate corresponding ts file in `src/charts/`.
 */
const extractSVGs = async () => {
  const SVG_PATH = 'svgs/';
  const TS_PATH = 'src/charts/';

  // get all charts

  const chartBase: IChartBaseRecord[] = [];

  const files = await fse.readdir(SVG_PATH);

  console.log(files);


  // await!!!!
  files.forEach(file => {
    // `file` should be a ChartID
    if (!CHART_ID_OPTIONS.includes(file as ChartID)) {
      rl.question(`The name of file ${file} is not a ChartID. Still want to add it? (y/n)`, yesOrNo => {
        if (yesOrNo.toLowerCase() === 'yes' || yesOrNo.toLowerCase() === 'y' || !yesOrNo) {
          chartBase.push({ svgFileName: file });
        } else {
          // tslint:disable-next-line: no-console
          console.log(`File ${file} is ignored.`);
        }
        rl.close();
      });
    }
  });

  console.log('xxxx');

  console.log(chartBase);

  const filePaths = files.map(file => path.join(process.cwd(), SVG_PATH, file));

  const svgs: string[] = await Promise.all(
    filePaths.map(
      async (filePath): Promise<string> => {
        return await fse.readFile(filePath, { encoding: 'utf8' });
      },
    ),
  );

  // optimize current svg images

  const optSvgs: string[] = await Promise.all(
    svgs.map(
      async (svg): Promise<string> => {
        const { data } = await svgo.optimize(svg);
        return data;
      },
    ),
  );

  // generate ts files

  await Promise.all(
    optSvgs.map(async (optSvg, index) => {
      const file = files[index];
      const fileName = path.basename(file, path.extname(file));
      const tsPath = path.join(process.cwd(), TS_PATH, `${fileName}.ts`);

      await fse.writeFile(tsPath, fileTemplate({ name: fileName, svgCode: optSvg }));
    }),
  );
};

(async () => {
  await extractSVGs();
})();
