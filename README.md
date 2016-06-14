# TestRail Integration (BETA)
## Note: this functionality will be available soon.

You made great choices if you want: 
1. You have file with test results and you want to publish your results in TestRail service.
2. See an example of module with ES2015 Standard.
3. Use separate command to auto-publish your test results.

## How to install
```
npm i test-rail -g
```

## How to use
```
test-rail <path-to-your-test-results*>
```

*Results of test should be in *.json format.

You can generate the file with results following next structure:
```
{
  "tests": [
    {
      "suite": "My suite", /* When you use multiple test suites you can provide suite name */
      "section": "My section", /* This name will be used as section of test case */
      "testcase": "Check required fields on login page", /* The name of your test case */
      "results": [ /* These steps are included to the test case */
        {
          "status": "passed", /* Status of step (result): passed or failed  */
          "comment": "User is logged successfully" /* The comment of step (result) */
        },
        {
          "status": "failed",
          "comment": "There is no email field"
        }
      ]
    }
  ]
}
```

## How it works?
* When you execute the command, the module will parse your file with results and publish test cases into TestRail. 
* The name of test case, suite or section will be automatically created in TestRail when it doesn't exist. Otherwise entered name will be used.
* After created of test cases, the run of these tests will be created and executed. 

### Authors
[Nginex](https://www.facebook.com/nginex) and [Den](https://www.facebook.com/r.denchik)
