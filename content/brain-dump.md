# Brain dump (raw Wispr transcripts, unedited)

## Corrections (apply in knowledge.md, keep the raw text as is)
- "Carbolager" / "Carbolayer" → **Carboledger**
- "Carblogger" → **Carboledger**
- "Electrathon 7.2 / 8.2" → **Electrothon 7.0 / 8.0**
- CGPA: **8.94** (not 9.84)
- Carboledger: **6-month internship, started July 2026, ongoing** (the resume's "Jul–Oct" end date is out of date)
- Q2 NOVA: "Java" → **Jarvis**; "first product I built" → **first Android / voice product** (Legal Sarthi and SeniorSays came earlier)
- Q2 Legal Sarthi: "Grok Java API" → **Groq (Llama-3.3-70B)**; "IPs" → **IPCs**; "preceding cases" → **precedent cases**; the precedent API he couldn't name → **Indian Kanoon**; it's a **team project**; the FIR image → text (AWS) part is **not built yet** (future scope); deployed on **EC2 with Docker**. ECS was only learned, not used, so the twin must not claim ECS
- Q5 skipped (write "care about" from the other answers: privacy, India-first, the real-life lawyer problem)
- Q6: "Seniors" → **SeniorSays**; "internal" → **interview**; debounce "3 ms" → **300 ms** (confirmed); the check fires after the user **stops** typing, not "continues"
- Q7: "developer lead" / "developer at Spec" → **Developer Relations Lead at SPEC**; "I will intentionally call it" → **I didn't call it growth back then**; "Indian accent and English" → **Indian accents and Hinglish**; "Electrothon Mindpointo" / "Electrothon 9" → **Electrothon 9.0**; "strength builders" → **student builders**; "exit users would love building their voice" → **exactly the users who'd love building by voice**

## Q1. Who are you?

### Take 1

hello everyone,

My name is Arpit Tyagi, and I am a third-year student from National Institute of Technology Hamirpur. It's in Himachal Pradesh, and my branch is Electronics and Communication Engineering. I'm a 2028 undergrad student, so I'm a third-year student. My current CGPA is 9.84.

Now, why? We might have thought, "I'm an EC student," what ended up being software. It's a first-year story. I joined a society. Societies are clubs in my institute, so I got to interact with my seniors. They organize a lot of workshops related to software and hardware. I explored both and got to know that if you want to continue with hardware, you have to be very master net, like PhD, etc., are needed, and pahati detailed thoroughly study karna padta hai us field mein.

Coming to the software part, when I started building the products, I got to know the kick that I get while building the products. That kick was somehow absent in building the hardware things, so I ended up in software.

I am doing an internship currently. It's a 6-month internship, and I've completed 3 months of my internship. I am doing it in a startup called Carbolager, and I joined there in July 2026. I'm working in their product team. There's a product called Smart Balance, aur hum us pe kaam kar rahe hain.

Carbolayer kya hai? Carbolayer is basically supply chain compliance software, ek aisa platform that automates ISCC mass balance bookkeeping. Simple words mein kahun to Carbolayer ek aisa startup hai jo ek software banata hai.

### Take 2

The CGPA is 8.94, and the internship is a 6-month internship that started in July.

Now, coming to what the Carblogger does, it's a supply chain compliance software platform that automates ISCC mass balance bookkeeping. It's a platform that maintains the entire supply chain.

Coming to the dev lead, I'm a developer relations lead at SPEC. It's a society for the promotion of electronic culture, and we organize hackathons. Its name is Electrathon, and I've been a part of 7.2 and 8.2. There at Electrathon, our main task is to deal with the speakers and judges and to increase the brand value for our society and Electrathon at the national level.
Coming to the hometown and family, I was born and brought up in Bijnor, Uttar Pradesh.

## Q2. Proudest projects

### Take 1 — NOVA

the proudest project I've built: I've built a lot of projects during my college years. It's a frontend, a backend, and a full-stack project. I've built a lot of projects, but for the proudest one, I would say I would like to involve two things: Nova and Legal Sarthi. I would like to explain both one by one.

Firstly, talking about Nova: have you heard about Java? Similarly, I have made my personal assistant. For example, I'm a college student. I have a lot of things to handle. I'm doing a side internship in startups. I have daily meetings to attend, college projects, many deadlines, and a lot of things I have to remember.

What I thought was to build a personal assistant who just informs me and gives me or sends me reminders. Like Google Meet can be added to the Google Calendar, but it can show a pop-up or notification that your Meet is in 50 minutes. I want someone as a personal AI assistant who I can give a command to, and then it responds.

I've given it certain access, like it can access my Google Meet. It can set the Meet. It gives me a reminder 1 hour prior to my Meets: "Your Meet is going to start in 1 hour." I added the Claude API key there. It can do a search as well. For example, suppose I want to know particular text, say, "What is this?" It can definitely search in Claude and narrate to me what it is.

I have given WhatsApp control as well. If I want someone to text, then it can directly text them and send that message to a particular person as well. Like iPhone's Siri, I made that feature in it as well. You can directly say, "Hey Nova, just call some XYZ person." If there are two contacts that match your needs, then it confirms with you whether you want to contact this person or this person. You can send the confirmation directly, and he calls that person.

It has data security as well. The APK I built has security features, like it doesn't leak my data. It's the first product I built. The voice model it uses is 55 MB. I didn't push that voice model to GitHub because it was taking too much time, so I just integrated it at build time. That's what it is about.

### Take 2 — Legal Sarthi

the second project number problem is Legal Sarthi. What is Legal Sarthi? It's like a SaaS product. We aim for lawyers. It's like an AI assistant for lawyers.
What hit me when I built this project was this: once, I went to a law office nearby my house for some documentation work, and there's an office there. I got to know that they have a lot of documents and files. Suppose a case came to them, they have to search and go through the IPCs and BNS, a lot of IPCs and BNS. There might be some preceding cases they have to refer to so that he can say in the court, "These IPCs were dropped in those particular cases, so this must be dropped here in my case as well."
That is how I built a project called Legal Sarthi. What is the architecture like?
Suppose there is a lawyer. He narrates his case, or he can type his case, or he can directly send the FIR image. The image part is not yet built, but it's a future scope that he can send an FIR, and using the AWS tech stack, we can extract the text from that.
There is a generate summary option for future reference. After sending it, it definitely goes through multiple LLM calls, like using Grok Java API keys, and it builds a lot of IPC sections and BNS sections corresponding to that summary.
After that, there are a lot of IPCs and BNS on the screen. He can definitely select and reject which particular IPC or BNS he has to select and reject, and add as well. After selecting it, a bunch of IPCs and BNS sections go to another API call. That API call basically brings a lot of preceding cases. That's not an LLM call. It's an API call. I'm forgetting the name of that particular platform whose API we have used. That brings the precedent cases.
Now we have done the embeddings as well to match which IPs or which case matches your precedent cases. Your current cases match 76% to that particular case on that date, and you can see the IPCs and BNS in those particular cases.
The major learnings, I would say, are:
- The test-driven development: we have written a lot of test cases there.
- The complete architecture: we have spent more time planning what feature should be there in our MVP and what should not be there. Instead of investing more time in coding, we have invested more time in planning.
- The new tech stack: I got to learn Fast API, AWS, EC2, and ECS. We have deployed on EC2. I got to learn Docker images through this project.
These were great learnings, and it's a team project. Handling the basic difference between rebase and merge things, and GitHub commands, I got to learn from these projects.

## Q6. How I think when stuck

### Take 1

coming to how I think when I get stuck: there was a story about a project I built called Seniors. It holds the interview experience of our campus students and places them in on-campus opportunities so that juniors can read about the experience and prepare for the placements.

There was a feature where the senior has to upload the resume and all the experience, and then the company name and everything about the interview. After submitting, they get to know that the slug we are using has already been taken by some of the other students.

I got a complaint from many seniors that it gets exhausting. It's not a good thing. It's not an optimized version: they are filling the whole form, and at the end of submission, they are getting "the slug has been taken." I added the debouncing condition at that time. It's a 3 ms debouncing condition. When the user is typing the slug and then typing the title, the title generates the slugs automatically. When it's typing the title of the internal, it hits the API to find whether a similar type of slug exists in the DB or not. For the debouncing, the user has to continue typing for 3 ms.

How do I think? I basically analyze the root cause. I took a pen and paper, and I walked through the root cause. I think out loud, go through the solution, and implement it. I think cheap first and expensive later. I plan a lot before implementing. As I mentioned the legal side thing, I planned what should be there in the features, what should be there in the MVPs, and what should be the core features we should offer to the person when he's using our product (instead of directly going through the coding part). Planning is one of the most important things when I get stuck, and I just write it down so that thing should not be repeated in the future.

## Q7. Why growth, why Wispr

### Take 1

I'm a developer, but my best moments were not writing code. They were getting things in front of people.

I've done a lot of things in my 3 years of college, like coming to that growth part. I can say I've been a part of Electrothon 7.0 and 8.0. As a developer lead, I brought a lot of speakers and judges and increased the brand value of our society and our Electrothon. That's basically a partnership and brand that is happening. I will intentionally call it a growth part.

The dashboard we built in our Electrothon 8.0: nearly 500 participants enrolled and used that dashboard. There was a lot of feedback we got from there, and we improved and optimized our platform. The real growth part, I would say, is about my cold mailing pipeline. For the internship, I ran weekly outreach and tackled a lot of replies through email. I've built a pipeline that sends the cold mails to the recruiters through LinkedIn and different hiring platforms. Boom.

Why Wispr specifically? As I mentioned, I built my personal AI agent called Nova. I know how fast and how hard it is for voice tech to understand the Indian accent and English. India is a voice note country. WhatsApp voice notes are everywhere. Indians already talk to their phones. Wispr has just turned that talking into work. I'm currently using that in my entire portfolio as well, which is built using my voice.

Coming to what I would really do, I can start on day one. As I mentioned, I'm a developer at Spec so I can bring Wispr to Electrothon Mindpointo as a partner. It's a national-level hackathon for the strength builders. The exit users would love building their voice. Being a part of college tech societies, which is known all around the country, it's the greatest opportunity. If we bring Wispr Flow to Electrothon 9 as a sponsor, definitely people can build using Wispr there.
