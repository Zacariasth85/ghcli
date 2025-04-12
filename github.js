import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const api = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Authorization: `token ${process.env.GITHUB_TOKEN}`,
  },
});

export async function listRepos(username) {
  const response = await api.get(`/users/${username}/repos`);
  return response.data.map(repo => repo.name);
}

export async function createRepo(name, description = '', isPrivate = false, licenseTemplate = '', gitignoreTemplate = '') {
  const response = await api.post('/user/repos', {
    name,
    description,
    private: isPrivate,
    license_template: licenseTemplate || undefined,
    gitignore_template: gitignoreTemplate || undefined,
    auto_init: true
  });
  return response.data.html_url;
}
