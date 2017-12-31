import fs from 'fs';
import path from 'path';
import {promisify} from 'util';
import render from 'preact-render-to-string';
import {h} from 'preact';

import Layout from './source/javascript/views/Layout';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const TEMPLATE_PATH = path.join(__dirname, 'public/index.html');
const INSERT_POINT = '<!-- CONTENT -->';

readFile(TEMPLATE_PATH, 'utf-8')
  .then(file =>  file.replace(INSERT_POINT, render(<Layout />)))
  .then(content => writeFile(TEMPLATE_PATH, content));