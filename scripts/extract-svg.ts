import { CHART_ID_OPTIONS, ChartID, CKBJson } from '@antv/knowledge';
import * as fse from 'fs-extra';
import * as inquirer from 'inquirer';
import * as path from 'path';
import * as SVGO from 'svgo';
import { SVGO_SETTINGS } from './svgo-settings';

interface IChartInfo {
  chartId: string;
  chartName: string;
  svgCode: string;
}

interface IChartBaseRecord {
  svgFileName: string;
  svgFilePath: string;
  tsFileName: string;
  tsFilePath: string;
  chartId: string;
  chartName: string;
  svgCode: string;
}

const SVG_PATH = 'svgs/';
const TS_PATH = 'src/charts/';

const genChartBaseRecord = async (fileName: string): Promise<IChartBaseRecord> => {
  const chartId = fileName;
  const chartName = CHART_ID_OPTIONS.includes(fileName as ChartID) ? ckb[fileName].name : fileName;

  const tsFileName = chartId;
  const tsFilePath = path.join(process.cwd(), TS_PATH, `${tsFileName}.ts`);

  const svgFilePath = path.join(process.cwd(), SVG_PATH, `${fileName}.svg`);

  const svg = await fse.readFile(svgFilePath as string, { encoding: 'utf8' });
  const { data: optSvg } = await svgo.optimize(svg);

  return {
    chartId,
    chartName,
    svgCode: optSvg,
    svgFileName: fileName,
    svgFilePath,
    tsFileName,
    tsFilePath,
  };
};

const svgo: SVGO = new SVGO(SVGO_SETTINGS);

const fileTemplate = ({ chartId, chartName, svgCode }: IChartInfo) => `// ${chartId}

const ${chartId} = {
  name: '${chartName}',
  svgCode: '${svgCode}'
};

export default ${chartId};
`;

const ckb = CKBJson();

/**
 * Extract svg images from `svgs/`, optimize svg codes
 * and then generate corresponding ts file in `src/charts/`.
 */
const extractSVGs = async () => {
  // get all charts

  const chartBase: IChartBaseRecord[] = [];

  const files = await fse.readdir(SVG_PATH);

  console.log(files);

  const questions: inquirer.Question[] = [];
  const notices: string[] = [];

  await Promise.all(
    files.map(async file => {
      const fileExtName = path.extname(file);
      const fileName = path.basename(file, fileExtName);

      if (fileExtName !== '.svg') {
        notices.push(`File ${file} is not with .svg and it has been ignored.`);
      } else {
        // `file` should be a ChartID
        if (CHART_ID_OPTIONS.includes(fileName as ChartID)) {
          chartBase.push(await genChartBaseRecord(fileName));
        } else {
          questions.push({
            default: false,
            message: `The name of file ${fileName} is not a ChartID. Still want to add it?`,
            name: fileName,
            type: 'confirm',
          });
        }
      }
    }),
  );

  // tslint:disable-next-line: no-console
  notices.forEach(notice => console.log(notice));

  await inquirer.prompt(questions).then(async answers => {
    console.log('>>>>>> ans');
    console.log(answers);

    await Promise.all(
      Object.keys(answers).map(async fileName => {
        if (answers[fileName]) {
          chartBase.push(await genChartBaseRecord(fileName));
        }
      }),
    );
  });

  console.log('xxxx');

  console.log(chartBase);

  // clear charts except index

  const currentTsFileNames = await fse.readdir(TS_PATH);
  const currentTsFilePaths = currentTsFileNames.map(fileName => path.join(process.cwd(), TS_PATH, fileName));
  await Promise.all(
    currentTsFilePaths.map(async tsPath => {
      if (path.basename(tsPath) !== 'index.ts') {
        await fse.unlink(tsPath);
      }
    }),
  );

  // generate ts files

  console.log('yyyyy');

  console.log(chartBase);

  await Promise.all(
    chartBase.map(async rec => {
      const { tsFilePath, chartId, chartName, svgCode } = rec;
      await fse.writeFile(tsFilePath, fileTemplate({ chartId, chartName, svgCode }));
    }),
  );
};

(async () => {
  await extractSVGs();
})();
