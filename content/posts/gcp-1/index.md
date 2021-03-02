---
title: "Getting Started in GCP"
date: 2021-03-02
hero: /posts/gcp-1/banner.png
description: Getting started in GCP
menu:
  sidebar:
    name: GCP-1
    identifier: gcp
    weight: 10
---

## Introduction

Hello Friends 👋  ,hope everyone doing good .In this blog I am going to share how we can get started with the GCP

## Outcomes

By the end of the article you will be able to create the project and setting up the billing alerts in the Google Cloud

## Pre-requisite

- Valid Gmail ID
- Valid credit card (Don't worry you wont be charged)

## Creating the Google Cloud Account

Go to the [Google-cloud](https://cloud.google.com/) page and create the google cloud account  if you don't have google cloud account already, On signing up you will get **300 USD** as the sign up bonus for one year which will be more than enough for learning and Google also gives some of the resources free forever you can read more about that [here](https://cloud.google.com/free/docs/gcp-free-tier)

## Creating the Project

Every GCP resource can be created only within the project. To create the new project click the drop down menu in the left corner

![Getting%20Started%20with%20GCP%2027f6b994f2024d819644ced25862b932/Screenshot_2021-03-02_at_12.10.23_PM.png](Getting%20Started%20with%20GCP%2027f6b994f2024d819644ced25862b932/Screenshot_2021-03-02_at_12.10.23_PM.png)

Click in the **NEW PROJECT** option ,enter the name of the project and click **Ok **

> Note we do have certain limitation on  number of projects that we can create under the free tier Keep this in mind while creating the project

![Getting%20Started%20with%20GCP%2027f6b994f2024d819644ced25862b932/Screenshot_2021-03-02_at_12.13.20_PM.png](Getting%20Started%20with%20GCP%2027f6b994f2024d819644ced25862b932/Screenshot_2021-03-02_at_12.13.20_PM.png)

## Setting up the billing alerts

While learning the GCP we want to make sure that we don't  accidentally ended up using more resources than the free tire ,In order to prevent the accidental cost we can setup the billing alert ,this will be also useful when we work in the organization 

 Click  the Billing Option in the left corner and select the default billing account

![Getting%20Started%20with%20GCP%2027f6b994f2024d819644ced25862b932/Screenshot_2021-03-02_at_12.25.23_PM.png](Getting%20Started%20with%20GCP%2027f6b994f2024d819644ced25862b932/Screenshot_2021-03-02_at_12.25.23_PM.png)

![Getting%20Started%20with%20GCP%2027f6b994f2024d819644ced25862b932/Screenshot_2021-03-02_at_12.29.05_PM.png](Getting%20Started%20with%20GCP%2027f6b994f2024d819644ced25862b932/Screenshot_2021-03-02_at_12.29.05_PM.png)

Click the Budget & alerts option and click create Budget

On the Next page enter the Name of the alerts we have to also set the following options

Projects - We can select either all projects or a particular project

Services - We can select either all services or particular services like compute , bucket

![Getting%20Started%20with%20GCP%2027f6b994f2024d819644ced25862b932/Screenshot_2021-03-02_at_12.31.10_PM.png](Getting%20Started%20with%20GCP%2027f6b994f2024d819644ced25862b932/Screenshot_2021-03-02_at_12.31.10_PM.png)

On the next page we will enter the amount for our example I have entered 1000rs

![Getting%20Started%20with%20GCP%2027f6b994f2024d819644ced25862b932/Screenshot_2021-03-02_at_12.34.52_PM.png](Getting%20Started%20with%20GCP%2027f6b994f2024d819644ced25862b932/Screenshot_2021-03-02_at_12.34.52_PM.png)

On the Next Page enter the threshold limits GCP by default creates 3 threshold limit we can either add or remove the threshold

![Getting%20Started%20with%20GCP%2027f6b994f2024d819644ced25862b932/Screenshot_2021-03-02_at_12.36.24_PM.png](Getting%20Started%20with%20GCP%2027f6b994f2024d819644ced25862b932/Screenshot_2021-03-02_at_12.36.24_PM.png)

Click **finish** once you have done .On successful creation you will see the new billing alert that we have created


## Conclusion

Thank you for reading my blog I hope you learned something If you have any comments or feel free to reach out me on [Twitter](https://twitter.com/joshva_jebaraj) Feel free to checkout my other articles at [my-website](https://www.joshuajebaraj.com/posts/)
