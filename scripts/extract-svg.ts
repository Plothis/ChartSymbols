import * as fse from 'fs-extra';
import * as path from 'path';
import * as SVGO from 'svgo';

import { SVGO_SETTINGS } from './svgo-settings';

const svgo: SVGO = new SVGO(SVGO_SETTINGS);

/**
 * Extract svg images from `svgs/`, optimize svg codes
 * and then generate corresponding ts file in `src/charts/`.
 */
const extractSVGs = async () => {
  const SVG_PATH = 'svgs/';
  const TS_PATH = 'src/charts/';

  // optimize current svg images
  const files = await fse.readdir(SVG_PATH);
  const filePaths = files.map(file => path.join(process.cwd(), SVG_PATH, file));

  const svgs: string[] = await Promise.all(
    filePaths.map(
      async (filePath): Promise<string> => {
        return await fse.readFile(filePath, { encoding: 'utf8' });
      },
    ),
  );

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

      const fileContent = `
const ${fileName} = {
  name: '${fileName}',
  svgCode: '${optSvg}'
};

export default ${fileName};
      `;
      await fse.writeFile(tsPath, fileContent);
    }),
  );
};

(async () => {
  await extractSVGs();
})();
