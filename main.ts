import * as core from '@actions/core';
import {HttpClient} from '@actions/http-client';

process.on('unhandledRejection', handleError);
main().catch(handleError);

function sleep(sec: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, sec * 1000));
}

async function waitForState(waitFor: string, http: HttpClient, baseUrl: string, id: any, retryCount: number, retryDelay: number): Promise<void> {
  let state: string | undefined = '';
  while (state !== waitFor && retryCount > 0) {
    state = (await http.getJson<{ state: string }>(`${baseUrl}/services/${id}`))?.result?.state;
    retryCount--;
    await sleep(retryDelay);
  }

  if (retryCount === 0) {
    throw new Error(`Maximum retries exceeded waiting for state ${waitFor}`);
  }
}

async function main() {
  const RANCHER_URL = core.getInput('rancher_url', {required: true});
  const RANCHER_ACCESS = core.getInput('rancher_access', {required: true});
  const RANCHER_KEY = core.getInput('rancher_key', {required: true});
  const PROJECT_ID = core.getInput('project_id', {required: true});
  const STACK_NAME = core.getInput('stack_name', {required: true});
  const SERVICE_NAME = core.getInput('service_name', {required: true});
  const DOCKER_IMAGE = core.getInput('docker_image', {required: true});
  const RETRY_COUNT = +core.getInput('retry_count');
  const RETRY_DELAY = +core.getInput('retry_delay');

  const http = new HttpClient('actions-rancher-deploy', undefined, {
    headers: {
      Authorization: `Basic ${Buffer.from(`${RANCHER_ACCESS}:${RANCHER_KEY}`).toString('base64')}`,
    },
  });
  const baseUrl = `${RANCHER_URL}/v2-beta/projects/${PROJECT_ID}`;

  let success = false;

  // Deployed
  await http.postJson(`${baseUrl}/service/${id}`, {});
  console.log('Waiting for deploy ...');
  await waitForState('deployed', http, baseUrl, id, RETRY_COUNT, RETRY_DELAY);

  console.log('Service is running, upgrade successful');
  core.setOutput('result', success);
}

function handleError(err: Error) {
  console.log(err);
  core.setFailed(err.message);
}
