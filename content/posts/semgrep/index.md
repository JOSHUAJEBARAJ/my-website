+++
authors = ["Joshua Jebaraj"]
title = "How to find Bugs in Android application Using Semgrep"
date = "2020-07-22"
description = "Introduction to Semgrep"
tags = ["Semgrep", "Android", "Security", "Tools"]
+++

## Introduction 

Hello, Friends Hope you are all staying safe and Happy. It's been a long time since I wrote the blog .Finally I am  able to kick my lazy ass and sit down to write the blog .

So I am a big fan of Android Security . In my free time I used to read and do some research around Android Security Even my first Blog is about [Android-Security](https://www.joshuajebaraj.com/publications/how-do-i-automate-the-enviroment-setup-for-android-pentesting-using-simple-bash-scripts/) . But I want to automate the Security scanner that able to pick up the most common Security Flaws  

So I ended up having two choices :

- Use a Pre-made Tool like [Mobsf](https://github.com/MobSF/Mobile-Security-Framework-MobSF) which is a great tool which I suggest must checkout
- Create your own tool

So I ended Selecting the second option


So the biggest problem with writing a custom scanner for black box testing in Android is eou will not get the same source code as written due to obfuscation.

Let's see the example what I meant

So you wrote the pattern to match the code


``` java
WebView.setWebContentsDebuggingEnabled(true);
```

You write the rule in any other existing tool or use the grep to find the above code It will able to find the code .

But the problem is due to obfuscation the code will not be the same as above this could be changed like

``` java
ew.setWebContentsDebuggingEnabled(true);
```
 
Now when we try to run the tool again, or grep again the tool can't able to find the code due to obfuscation .


![m1](https://raw.githubusercontent.com/JOSHUAJEBARAJ/blog-images/master/semgrep/meme.jpg)

## Semgrep 

Here Comes the [Semgrep](https://github.com/returntocorp/semgrep) into play .Before gets into the detail, lets have a quick look about the `Semgrep`

According to the Official Docs

```
Lightweight static analysis for many languages.
Find and block bug variants with rules that look like source code.
```

Here are a few ways that Semgrep more has an advantage over another too

- Easy to install 

All you need is `pip3` installed in your System

You can install Semgrep by typing the below command 

``` bash
pip3 install semgrep
```

- Supports Multiple Language like Go,Java,JavaScript,JSON,Python,Ruby(beta),JSX(beta),C(alpha),OCaml(alpha)

- Can be easily integrate into CI/CD pipeline

- Has a Registry with Predefined Rules

So without wasting time wasted ,let's get started 

## Hello-world

For the hands-on part, I am going to use the [Semgrep-Live-editor](https://semgrep.dev/editor) which allow me to write the rules on the fly .You can either test your rules here like I do or you could test locally with the **semgrep-cli** tool that you installed using pip


Let's try to understand the various components in  creating the rules  Below is example of simple semgrep rule This rule looks for the `System.out.println("Hello")` in the hello world-program

``` yaml
rules:
- id: Hello-world
  metadata:
       author: Joshua
  message: |
        System.out.println Found
  patterns:
  - pattern: System.out.println("Hello");
  severity: WARNING
  languages:
  - java
```

let's try to understand the above yaml 

- id - Here we specify the  id of the rule
- metadata - Here we can specify the additional information
- message - Here we specify the message to be shown on pattern match
- pattern - Here we specify the pattern  to be matched
- severity - Here we specify the severity
- languages - Here we specify the language

Copy and paste the above YAML in the `semgrep-rule` field and put the hello-world code in the `Test-code` Field and click **RUN**

![he](https://raw.githubusercontent.com/JOSHUAJEBARAJ/blog-images/master/semgrep/hell.png)

Ya, we have successfully written  our first rule !


So let's get started .To give a quick heads up this blog is more focused on the tool rather than the vulnerabilities So I will not be explaining the vulnerability .

##  Vulnerabilities

### WebView Debug mode
The First vulnerability that we are going to find is debug mode was enabled in the web view of the Android application

This is what the code look like in the plain java for the above vulnerability

``` java
 WebView.setWebContentsDebuggingEnabled(true);
```

The problem here is on reversing the Android application the  `Webview` can become obfuscated .Let's see how we can solve this with Semgrep

We are going to use one  of the feature of Semgrep called **Metavarialble** . A Metavariable is the variable which is replaced by any variable in the runtime .

Below is the Semgrep pattern that we are going to use

```
$RUNTIME.setWebContentsDebuggingEnabled(true);
```
![img](https://raw.githubusercontent.com/JOSHUAJEBARAJ/blog-images/master/semgrep/image-1.png)

You could See the Semgrep could able to find the matching pattern Lets try to replace the Webview with another value 

![img-2](https://raw.githubusercontent.com/JOSHUAJEBARAJ/blog-images/master/semgrep/iamge-2.png)

You could See Its successfully able to find out that right Lets See What are the other thing that Semgrep Got us to offer

### Insecure Logging
The next vulnerability that we are going to cover was Insecure Logging 

This is What the Code look like in the plain java

``` java
Log.e("Hello")

```

``` java
Log.e("Tag","Hello From Tag")
```

The problem with this code is that the tag parameter is optional, so there may be code with or without the tag. his is where the ellipsis operator comes into play: the ellipsis operator allow us to match 0 or more arguments.

Below is the Semgrep pattern that we are going to use

``` yaml
Log.e(...)
```

Let's try to match the code without a tag .

![log1](https://raw.githubusercontent.com/JOSHUAJEBARAJ/blog-images/master/semgrep/log1.png)

You can see it successfully finds the code matching this pattern.

Lets try with log function that uses tag flag.

![log2](https://raw.githubusercontent.com/JOSHUAJEBARAJ/blog-images/master/semgrep/log2.png)

By default, Semgrep uses the **and** operator but in a certain situation, we want to perform an **or** operation that matches either one of the pattern . To achieve that Semgrep provide `pattern-either`  option where the semgrep will perform or operation .

Let's take the example you want to find the hardcoded-secret and  the variable name could be pass or password .The Semgrep should match any one of the variables .

> Note to follow the further exercises you have to switch to the `Advanced` tab in the website


![pat-1](https://raw.githubusercontent.com/JOSHUAJEBARAJ/blog-images/master/semgrep/pattern-1.png)

Semgrep could able to find the pattern. Let's try to replace the variable name with **pass**.

![pat-2](https://raw.githubusercontent.com/JOSHUAJEBARAJ/blog-images/master/semgrep/pattern-2.png)


Sometimes you want to filter out the patterns that you are not looking for. In those situations you can use **pattern-not** .Let's take the first example Instead of matching all Log message you want to match the log message which is not info log (Note: we are assuming here the Log.info doesn't have any sensitive info but in the real-world,this may vary)

``` java
Log.e("Hello"); // this should be matched
Log.i("Hello Info); // this shouldn't be matched
```

Let's try to create the  pattern with the **pattern-not** flag

``` yaml
rules:
- id: Log Message
  patterns:
    - pattern: |
          Log.$RUNTIME(...);
    - pattern-not: |
        Log.i(...);
  message: |
    Semgrep found a match
  severity: WARNING

```

![log-i](https://raw.githubusercontent.com/JOSHUAJEBARAJ/blog-images/master/semgrep/log-i.png)

You could see its matches all other patterns than `Log.i` .This  way you could write  rules  to find  bugs in  Android application .

There are many features that Semgrep offers .In my blog I cover a few features, but if you are interested in more, then I high Recommend you to check out the resources in the reference section, and I highly recommend you to join the Official Slack Channel [here](http://r2c.dev/slack)

If you have any questions or feedback feel free to reach out to me on [Twitter](https://twitter.com/joshva_jebaraj?lang=en) .

Thanks to [Pablo Estrada](https://twitter.com/pabloest) for proof reading the blog, and the [r2cdev](https://twitter.com/r2cdev) for the awesome tool

Thanks for reading and have a nice day !.

## References

- [Semgrep-Docs](https://semgrep.dev/)
- [Semgrep A Practical Introduction](https://notsosecure.com/semgrep-a-practical-introduction/)
- [Semgrep presentation by r2c at Bay Area OWASP Meetup](https://www.youtube.com/watch?v=pul1bRIOYc8)
- [Mobsf-rules](https://github.com/MobSF/Mobile-Security-Framework-MobSF/blob/master/StaticAnalyzer/views/android/rules/android_rules.yaml)
- [Semgrep-Learning](https://semgrep.dev/learn)