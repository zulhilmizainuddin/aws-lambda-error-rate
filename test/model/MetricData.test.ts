import {expect} from 'chai';

import * as sinon from 'sinon';

import {Duration} from '../../enum/Duration';
import {MetricData, MetricErrorRate} from '../../model/MetricData';
import {MetricTime, MetricTimeRange} from '../../model/MetricTimeRange';
import {Period} from '../../enum/Period';

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
        const metricTimeRange = new MetricTimeRange();
        const metricTime: MetricTime = metricTimeRange.calculate('2018-09-16T00:10:56.062+0000', Duration.ThreeHundredSeconds);

        const metricData = new MetricData();
        sandbox.stub(MetricData.prototype, 'getMetricDataOutput').callsFake(() => {
            return metricDataOutput;
        });

        const metricErrorRates: MetricErrorRate[] = await metricData.getMetricErrorRates('aws-lambda-error-rate-dev-error', metricTime, Period.SixtySeconds);

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