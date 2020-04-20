# Routes-cli

Routes-cli is a cli software that will give you the cheapest route to go from location A to B.

The data source is a local CSV file containing all possible connections and their respective costs.

Running this software will do three things:

- Load data from a file
- Expose a local REST API server (http://localhost:3000)
- Start a command line interface

## Summary

- [Prerequisites](#Prerequisites)
- [Installation](#Installation)
- [Usage](#Usage)
- [Cli](#Cli)
- [REST API](#REST-API)
- [Uninstall](#Uninstall)
- [Project Considerations](#Project-Considerations)
- [Caveats and Improvements](#Caveats-and-Improvements)

## Prerequisites

You will need Node > 12.0.0 and npm to run this software.

## Installation

First, extract the contents of this zip file into a folder.

Inside that folder, use npm to install routes-cli globally:

```shell
npm start
```

or

```shell
npm run add
```

Then `routes-cli` will be available globally as a console command.

## Usage

You will need a text file formatted as comma-separated values, e.g.:

```csv
GRU,BRC,10
BRC,SCL,5
GRU,CDG,75
GRU,SCL,20
GRU,ORL,56
ORL,CDG,5
SCL,ORL,20
```

To start the software, simply run in terminal:

```shell
routes-cli <filePath>
```

### Example

```shell
routes-cli input-example.txt
```

## CLI

The cli service will prompt for a route in the format ORIGIN-DESTINATION and will return the cheapest route available, with the connections required and the total cost.

entries are case-insensitive.

### Example

```shell
Please enter the route:GRU-CDG
Best route: GRU - BRC - SCL - ORL - CDG > $40
Please enter the route:orl-cdg
Best route: ORL - CDG > $5
Please enter the route:|
```

You can exit the program at anytime by entering "exit" as input.  
**eg**

```shell
Please enter the route:exit
```

## REST API

The api service exposes three endpoints:

- [GET /routes](#GET-/routes)
- [POST /routes](#POST-/routes)
- [GET /routes/{origin}/{destination}](#GET-/routes/{origin}/{destination})

Responses are always given in JSON (`Content-Type: application/json`);

### Errors

Response errors have the following pattern:

##### Response status: `400` OR `404`

```json
{
  "statusCode": 400 / 404,
  "message": "Descriptive error message"
}
```

### Endpoints

- #### GET /routes

  Returns all existing connections with their respective costs in the following format (for a connection from POINT-A to POINT-B at a cost of \$999):

  ```json
  {
    "POINT-A": {
      "POINT-B": 999
    }
  }
  ```

  ##### Response status (success): `200`

  ##### Example response body:

  ```json
  {
    "ORL": {
      "CDG": 5
    },
    "SCL": {
      "ORL": 20
    },
    "BRC": {
      "SCL": 5
    },
    "GRU": {
      "BRC": 10,
      "CDG": 75,
      "SCL": 20,
      "ORL": 56
    },
    "CDG": {}
  }
  ```

- #### POST /routes

  Add a new connection (from `POINT-A` to `POINT-B`) at a determined `cost`.

  If `Content-Type` header is `text/csv` or `text/plain`, a newline-delimited csv request body is expected.  
  Otherwise, a JSON is expected.  
  **_Note: if using csv as request body, it is possible to add multiple connections at once (one per line)_**

  ##### Request body:

  ###### JSON:

  ```json
  {
    "origin": "POINT-A",
    "destination": "POINT-B",
    "cost": 999
  }
  ```

  ###### CSV:

  ```csv
  POINT-A,POINT-B,999
  ```

  ###### CSV (multiple connections):

  ```csv
  POINT-A,POINT-B,999
  POINT-A,POINT-C,55.5
  POINT-C,POINT-B,22.54
  ```

  **`origin` and `destination` fields are required.  
  If `cost` is omitted, a default value of `0` will be used**

  #### Response status (success): `204`

  #### No response body

- #### GET /routes/{origin}/{destination}

  Returns the cheapest route from `origin` to `destination`, as well as the total `cost`;

  #### Response status (success): `200`

  #### Example response body (example url path: /routes/GRU/CDG):

  ```json
  {
    "origin": "GRU",
    "destination": "CDG",
    "route": "GRU - BRC - SCL - ORL - CDG",
    "cost": 999
  }
  ```

## Uninstall

To uninstall routes-cli simply run:

```shell
npm run remove
```

---

## Project Considerations

### On the choice of Node js

My reasoning for choosing Node js for this project revolved mainly around three points:

- Personal familiarity
  - Due to time constraints, I felt it was better to stick to the language I know the most
- Node performs great for REST APIs and is also great for cross-platform projects
- Node has amazing performance when it comes to heavy I/O
- Node has a vibrant community online, so it is relatively easy to find modern and up-to-date documentation, references and solutions that can easily be applied to the problem at hand
- Fast development

Read my [comments on the caveats](#Node-js) of choosing node for this project.

### On the Dijkstra's algorithm

This is usually the go-to algorithm for this kind of problem (finding the lowest-weight path between two nodes in a graph).
The algorithm is usually done as in to calculate the lowest-weight path to ALL nodes from a starting node, so I adapted it to fit the problem better.

### On the Priority Queue implementation

While I would really like to take credit for this elegant priority queue implementation, it was actually taken from Google Closure Library.
I just adapted it to make it simpler by removing all the unnecessary dependencies and methods.

### On the use of external packages/libraries

I did my best to keep the use of external packages to a minimum, so there are no dependencies required to run the program.
The only dependencies are Dev dependencies, used to link and format the code (eslint/prettier) and for the unit testing (jest/supertest)  
If I could add external dependencies, I would add:

- REST API framework (Koa is my go-to choice), as it makes the code much easier to write and read while adding fairly little overhead to Node's native http module.
- Priority Queue implementations (no need to reinvent the wheel, right?)

## Caveats and Improvements

#### Node js

Yes, Node js is great for APIs due to its async nature.  
However, because of Node's single-threaded execution the dijkstra's algorithm, as well as the priority queue used in it, would be much better off implemented in a lower-level language such as Go or C++.  
Ideally, they would be written in C++ and then used as a Node Add-on, improving performance a great deal.

To circumvent this issue in a much easier way while still achieving a considerable performance boost,  
I made use of Node's Worker Threads module, therefore running the algorithm in a parallel thread.

#### File persistency

I opted to NOT keep the input file in sync throughout the execution of the program, as this would considerably increase the use of Node's execution thread ([read above](#Node-js)).
The file is updated once the program's execution is interrupted for whatever reason.
