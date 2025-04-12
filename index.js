#!/usr/bin/env node

import { program } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import dotenv from 'dotenv';
import { listRepos, createRepo } from './github.js';

dotenv.config();

program
  .version('1.0.0')
  .description('CLI para interagir com o GitHub');

program
  .command('listar <usuario>')
  .description('Lista repositórios públicos de um usuário')
  .action(async (usuario) => {
    try {
      const repos = await listRepos(usuario);
      console.log(chalk.green(`Repositórios de ${usuario}:`));
      repos.forEach(repo => console.log(`- ${repo}`));
    } catch (err) {
      console.error(chalk.red('Erro ao listar repositórios:'), err.message);
    }
  });

program
  .command('criar')
  .description('Cria um novo repositório')
  .action(async () => {
    const answers = await inquirer.prompt([
      { name: 'name', message: 'Nome do repositório:' },
      { name: 'description', message: 'Descrição (opcional):' },
      {
        type: 'confirm',
        name: 'isPrivate',
        message: 'O repositório deve ser privado?',
        default: false
      },
      {
        type: 'list',
        name: 'license',
        message: 'Escolha uma licença:',
        choices: ['mit', 'apache-2.0', 'gpl-3.0', 'bsd-2-clause', 'bsd-3-clause', 'unlicense', 'Nenhuma'],
        default: 'mit'
      },
      {
        type: 'list',
        name: 'gitignore',
        message: 'Escolha um template de .gitignore:',
        choices: ['Node', 'Python', 'Java', 'C', 'C++', 'VisualStudio', 'Nenhum'],
        default: 'Node'
      }
    ]);

    const license = answers.license === 'Nenhuma' ? '' : answers.license;
    const gitignore = answers.gitignore === 'Nenhum' ? '' : answers.gitignore;

    try {
      const url = await createRepo(
        answers.name,
        answers.description,
        answers.isPrivate,
        license,
        gitignore
      );
      console.log(chalk.green(`Repositório criado com sucesso: ${url}`));
    } catch (err) {
      console.error(chalk.red('Erro ao criar repositório:'), err.response?.data?.message || err.message);
    }
  });

program.parse(process.argv);
