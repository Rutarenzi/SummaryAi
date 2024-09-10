# SummaryAI

## Overview

The SummaryAI is designed to help users summarize their notes efficiently and store both the original notes and their summaries for future reference. This tool leverages Chargpt api and its techniques to generate concise summaries of lengthy texts, enabling users to quickly review and recall important information
![Alt text](src/frontend/src/assets/summarywork.png)


## Key Features of SummaryAI

### Key Features

1. **Summarize Notes:**
   - Generate concise summaries for your notes.
   
2. **Edit Notes and Resummarize:**
   - Edit your notes and generate updated summaries to reflect changes.
   
3. **Deletes single Note and Associated Summary:**
   - Remove note and their corresponding summary from the system.
   
4. **Get All Notes and Associated Summaries:**
   - Retrieve all stored notes and their summaries for review.
   
5. **Delete All Notes and Associated Summaries:**
   - Clear all notes and their summaries from the system with a single action.



## Scope

The SummaryAI tool is designed to be versatile and user-friendly, making it suitable for anyone who needs to efficiently summarize their notes to approximately one-third of the original length. Whether you are a student needing to condense lecture notes, a lecturer preparing concise teaching materials, a proofreader summarizing documents, or an author creating brief overviews, SummaryAI provides an effective solution for generating and managing summaries. Its easy-to-use interface and powerful NLP capabilities ensure that your summaries are accurate and useful, regardless of the content or context.


## Feedback

We welcome user feedback to continuously improve SummaryAI.

## Data Flow

1. User provide Note to be summarized.

2.Note is sent to backend endpoint and then prompt to ChatGpt Api.

3. Backend ChatGpt: Processes prompt and generates response(summary).\*\*

4.Backend stores note & response(summary) in Internet Computer canister

5. Backend sends response to Frontend.

6. Frontend displays response.


### Prerequisites

Before you begin, ensure you have met the following requirements:

- **dfx**: You have installed the latest version of the DFINITY Canister SDK, `dfx`. You can download it from the DFINITY SDK page. [installation guide](https://demergent-labs.github.io/azle/get_started.html#installation)

 ```
  use version dfx 0.21.0
 ```
- **Node.js**: You have installed Node.js, version 18 or above.
```
 v20.12.2

```
- Azle version use 
 ```
  azle 0.23.0
 ```

 - podman verion use

 ```
  podman version 3.4.4
  
 ```
Please ensure all these prerequisites are met before proceeding with the setup of the project.

### Recommendation:

For seamless run,get your_openai_api_key before you proceed
```
 go to src/frontend/src/callApi.js assign your key to a variable call CHATGPT_API_KEY
```


# Running the project locally

If you want to test your project locally, you can use the following commands:

Cloning repo:

```bash
git clone https://github.com/ahdrahees/baatcheet.git
cd SummaryAi
```


### to install and deploy Step by Step Follow below commands:

```bash
# install the azle dfx extension
npx azle install-dfx-extension

# Installing Dependencies
npm i

# Starts the replica, running in the background
dfx start --host 127.0.0.1:8000 --clean --background

# Deploys
dfx deploy
or

AZLE_AUTORELOAD=true dfx deploy
```

Once the job completes, your application will be available at `http://localhost:8080?canisterId={asset_canister_id}`.
