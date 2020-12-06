import { CHART_ID_OPTIONS, ChartID } from '@antv/knowledge';
import * as fse from 'fs-extra';
import * as inquirer from 'inquirer';
import * as path from 'path';
import * as SVGO from 'svgo';
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

  const questions: inquirer.Question[] = [];
  const notices: string[] = [];

  files.forEach(file => {
    const fileExtName = path.extname(file);
    const fileName = path.basename(file, fileExtName);

    if (fileExtName !== '.svg') {
      notices.push(`File ${file} is not with .svg and it has been ignored.`);

      return;
    }

    // `file` should be a ChartID
    if (!CHART_ID_OPTIONS.includes(fileName as ChartID)) {
      questions.push({
        default: false,
        message: `The name of file ${fileName} is not a ChartID. Still want to add it?`,
        name: fileName,
        type: 'confirm',
      });
    }
  });

  // tslint:disable-next-line: no-console
  notices.forEach(notice => console.log(notice));

  await inquirer.prompt(questions).then(answers => {
    console.log('>>>>>> ans');
    console.log(answers);

    Object.keys(answers).forEach(fileName => {
      chartBase.push({ svgFileName: fileName, svgFilePath: path.join(process.cwd(), SVG_PATH, `${fileName}.svg`) });
    });
  });

  console.log('xxxx');

  console.log(chartBase);

  const svgs: string[] = await Promise.all(
    chartBase
      .filter(rec => rec.svgFilePath)
      .map(
        async (rec): Promise<string> => {
          const { svgFilePath } = rec;
          return await fse.readFile(svgFilePath as string, { encoding: 'utf8' });
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
