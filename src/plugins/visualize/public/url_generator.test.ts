/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * and the Server Side Public License, v 1; you may not use this file except in
 * compliance with, at your election, the Elastic License or the Server Side
 * Public License, v 1.
 */

import { createVisualizeUrlGenerator } from './url_generator';
import { esFilters } from '../../data/public';

const APP_BASE_PATH: string = 'test/app/visualize';
const VISUALIZE_ID: string = '13823000-99b9-11ea-9eb6-d9e8adceb647';
const INDEXPATTERN_ID: string = '13823000-99b9-11ea-9eb6-d9e8adceb647';

describe('visualize url generator', () => {
  test('creates a link to a new visualization', async () => {
    const generator = createVisualizeUrlGenerator(() =>
      Promise.resolve({
        appBasePath: APP_BASE_PATH,
        useHashedUrl: false,
      })
    );
    const url = await generator.createUrl!({ indexPatternId: INDEXPATTERN_ID, type: 'table' });
    expect(url).toMatchInlineSnapshot(
      `"test/app/visualize#/create?_g=()&_a=()&indexPattern=${INDEXPATTERN_ID}&type=table"`
    );
  });

  test('creates a link with global time range set up', async () => {
    const generator = createVisualizeUrlGenerator(() =>
      Promise.resolve({
        appBasePath: APP_BASE_PATH,
        useHashedUrl: false,
      })
    );
    const url = await generator.createUrl!({
      timeRange: { to: 'now', from: 'now-15m', mode: 'relative' },
      indexPatternId: INDEXPATTERN_ID,
      type: 'table',
    });
    expect(url).toMatchInlineSnapshot(
      `"test/app/visualize#/create?_g=(time:(from:now-15m,mode:relative,to:now))&_a=()&indexPattern=${INDEXPATTERN_ID}&type=table"`
    );
  });

  test('creates a link with filters, time range, refresh interval and query to a saved visualization', async () => {
    const generator = createVisualizeUrlGenerator(() =>
      Promise.resolve({
        appBasePath: APP_BASE_PATH,
        useHashedUrl: false,
        indexPatternId: INDEXPATTERN_ID,
        type: 'table',
      })
    );
    const url = await generator.createUrl!({
      timeRange: { to: 'now', from: 'now-15m', mode: 'relative' },
      refreshInterval: { pause: false, value: 300 },
      visualizationId: VISUALIZE_ID,
      filters: [
        {
          meta: {
            alias: null,
            disabled: false,
            negate: false,
          },
          query: { query: 'q1' },
        },
        {
          meta: {
            alias: null,
            disabled: false,
            negate: false,
          },
          query: { query: 'q1' },
          $state: {
            store: esFilters.FilterStateStore.GLOBAL_STATE,
          },
        },
      ],
      query: { query: 'q2', language: 'kuery' },
      indexPatternId: INDEXPATTERN_ID,
      type: 'table',
    });
    expect(url).toMatchInlineSnapshot(
      `"test/app/visualize#/edit/${VISUALIZE_ID}?_g=(filters:!(('$state':(store:globalState),meta:(alias:!n,disabled:!f,negate:!f),query:(query:q1))),refreshInterval:(pause:!f,value:300),time:(from:now-15m,mode:relative,to:now))&_a=(filters:!((meta:(alias:!n,disabled:!f,negate:!f),query:(query:q1))),query:(language:kuery,query:q2))&indexPattern=${INDEXPATTERN_ID}&type=table"`
    );
  });
});
