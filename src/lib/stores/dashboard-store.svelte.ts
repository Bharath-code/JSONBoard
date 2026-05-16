import { examples } from '$lib/jsonboard/examples';
import { buildDashboard, redactDashboard } from '$lib/jsonboard/dashboard';
import type { DashboardModel, SortState } from '$lib/jsonboard/types';

export function createDashboardStore() {
  let input = $state(examples.api.value);
  let dashboard = $state<DashboardModel | null>(null);
  let error = $state<string | null>(null);
  let query = $state('');
  let sort = $state<SortState>(null);
  let isSharing = $state(false);

  function generate() {
    error = null;
    try {
      dashboard = buildDashboard(input);
      query = '';
      sort = null;
    } catch (cause) {
      error = cause instanceof Error ? cause.message : 'Could not parse this payload.';
    }
  }

  function loadExample(key: keyof typeof examples) {
    input = examples[key].value;
    generate();
  }

  function redactSensitive() {
    if (!dashboard) return;
    dashboard = redactDashboard(dashboard);
    input = dashboard.rawInput;
  }

  function prepareShare() {
    isSharing = true;
  }

  function closeShare() {
    isSharing = false;
  }

  return {
    get input() {
      return input;
    },
    set input(value: string) {
      input = value;
    },
    get dashboard() {
      return dashboard;
    },
    get error() {
      return error;
    },
    get query() {
      return query;
    },
    set query(value: string) {
      query = value;
    },
    get sort() {
      return sort;
    },
    set sort(value: SortState) {
      sort = value;
    },
    get isSharing() {
      return isSharing;
    },
    generate,
    loadExample,
    redactSensitive,
    prepareShare,
    closeShare
  };
}
