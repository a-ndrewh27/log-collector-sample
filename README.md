# Log Collection REST API Sample

## Getting Started

1. Clone this repository and install dependencies

```
> git clone https://github.com/a-ndrewh27/log-collector-sample.git
> cd log-collector-sample

> npm i
```

2. Run via command `npm run server`
3. Example API is running on `localhost:3000`

## GET Routes

| resource                     | description                                                              |
| :--------------------------- | :----------------------------------------------------------------------- |
| `/logs/?filename={filename}` | returns lines from log file within `/var/log/`, ordered newest -> oldest |

Note `filename` is a required parameter

## Parameters

| parameter             | description                                     |
| :-------------------- | :---------------------------------------------- |
| `filename={filename}` | **required** -- name of file within `/var/log/` |
| `limit={limit}`       | number of results (default is 1000)             |
| `search={search}`     | text or keyword to match in log line            |

### Example query using URI parameters

```
http://localhost:3000/logs?filename=install.log&limit=50
```

## Unit Tests

Run unit tests via command:

```
npm run test
```
