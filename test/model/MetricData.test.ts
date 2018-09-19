import {expect} from 'chai';

import * as sinon from 'sinon';

import {MetricData, MetricErrorRate} from '../../model/MetricData';
import {MetricTimeRange, MetricTimeRangeHelper} from '../../model/MetricTimeRange'

describe('MetricData', () => {
    let sandbox: any;
    let metricDataOutput: any;

    before(() => {
        sandbox = sinon.createSandbox();

        metricDataOutput = {
            "ResponseMetadata":{
               "RequestId":"7f3662e6-b946-11e8-bb3a-81126282ae11"
            },
            "MetricDataResults":[
               {
                  "Id":"errors",
                  "Label":"Errors",
                  "Timestamps":[
                     "2018-09-16T00:05:00.000Z",
                     "2018-09-16T00:06:00.000Z",
                     "2018-09-16T00:07:00.000Z",
                     "2018-09-16T00:08:00.000Z",
                     "2018-09-16T00:09:00.000Z"
                  ],
                  "Values":[
                     0,
                     0,
                     0,
                     0,
                     0
                  ],
                  "StatusCode":"Complete",
                  "Messages":[
         
                  ]
               },
               {
                  "Id":"invocations",
                  "Label":"Invocations",
                  "Timestamps":[
                     "2018-09-16T00:05:00.000Z",
                     "2018-09-16T00:06:00.000Z",
                     "2018-09-16T00:07:00.000Z",
                     "2018-09-16T00:08:00.000Z",
                     "2018-09-16T00:09:00.000Z"
                  ],
                  "Values":[
                     14,
                     14,
                     14,
                     14,
                     12
                  ],
                  "StatusCode":"Complete",
                  "Messages":[
         
                  ]
               },
               {
                  "Id":"errorrate",
                  "Label":"errorrate",
                  "Timestamps":[
                     "2018-09-16T00:05:00.000Z",
                     "2018-09-16T00:06:00.000Z",
                     "2018-09-16T00:07:00.000Z",
                     "2018-09-16T00:08:00.000Z",
                     "2018-09-16T00:09:00.000Z"
                  ],
                  "Values":[
                     0,
                     0,
                     0,
                     0,
                     0
                  ],
                  "StatusCode":"Complete",
                  "Messages":[
         
                  ]
               }
            ]
         };
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('get metric error rates', async () => {
        const metricTimeRange: MetricTimeRange = MetricTimeRangeHelper.calculate('2018-09-16T00:10:56.062+0000', 300);

        const metricData = new MetricData();
        sandbox.stub(MetricData.prototype, 'getMetricDataOutput').callsFake(() => {
            return metricDataOutput;
        });

        const metricErrorRates: MetricErrorRate[] = await metricData.getMetricErrorRates('aws-lambda-error-rate-dev-error', metricTimeRange, 60);

        expect(metricErrorRates).to.deep.equals([
            {
                "timestamp":"2018-09-16T00:05:00.000Z",
                "errorRate":0
            },
            {
                "timestamp":"2018-09-16T00:06:00.000Z",
                "errorRate":0
            },
            {
                "timestamp":"2018-09-16T00:07:00.000Z",
                "errorRate":0
            },
            {
                "timestamp":"2018-09-16T00:08:00.000Z",
                "errorRate":0
            },
            {
                "timestamp":"2018-09-16T00:09:00.000Z",
                "errorRate":0
            }
        ]);
    });
});