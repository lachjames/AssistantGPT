# AssistantGPT

This is a simple and clean interface for ChatGPT/GPT-4.

## Usage
### Website
AssistantGPT is currently hosted on GitHub Pages at https://lachjames.github.com/AssistantGPT. Note that the site is entirely static (and the source is available here so you're more than welcome to check that!) and makes calls directly to the OpenAI API from your browser.

### Local
Of course, you're welcome to download this repo and run it locally (it's just a typical Create-React-App project so you can run it with `npm start` after installing the dependencies with `npm install`). But it's no different to the GitHub Pages version (as both run locally in your browser), so I'd suggest just using that for convenience.

## Features
- Simple interface
- Save and load conversations
- Navigate backwards and forwards in the chat, and start new threads at any point
- Designed with "desktop-first" in mind (but works fine on mobile too)
- Supports ChatGPT (GPT 3.5) and GPT-4
- Can disable the warning (but please, read it first, and don't disable it if you share the machine with others!)

## Settings
You can use either GPT 3.5 (ChatGPT) or GPT-4 - I recommend the latter if you have API access (and don't mind paying the ~20x extra per token), since it's significantly better, but if you don't, ChatGPT is still quite good.

## Privacy, Safety, and Ethics
AI is a powerful tool, and it's proving more and more controversial over time. My experience with GPT-4 has been extremely positive, personally, but I'm aware that many people are concerned about it.

This tool is designed for one purpose: to allow people to use GPT-3.5 and GPT-4 for learning and working, as efficiently as possible. I make no claims, guarantees, or other representations about the safety, privacy, or ethics of the OpenAI API, and it should go without saying that I am not responsible for anything that happens as a result of using this tool, nor do I endorse any particular use of it.

While the site is entirely static (again, you're welcome to check!), I can't make any guarantees about the privacy of OpenAI's APIs (indeed, as of writing - 16th April 2023 - they are currently under fire for just that in multiple juristictions). I recommend caution. There is an option in Settings to disable the small warning at the bottom of the chat window about safety, which you may use at your discretion.