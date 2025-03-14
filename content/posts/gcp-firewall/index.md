---
title: "Understanding Firewalls in GCP"
date: 2025-03-13
hero: posts/gcp-firewall/image.jpg
description: In this Blog we will learn about firewalls in GCP
menu:
  sidebar:
    name: Google-Cloud-Firewalls
    identifier: google-cloud-firewalls
    weight: 10
---

# Firewalls in GCP 

Hey Folks its been a ~while~ years I wrote a blog about GCP. In this blog we will learn about the basics of various firewall in Google Cloud . 


Before starting Lets try to understand what is Firewall in first place Acccording to the wikipedia


> In computing, a firewall is a network security system that monitors and controls incoming and outgoing network traffic based on configurable security rules.

Firewall is nothing but a filter for the network traffic

In GCP we have three types of firewalls 
1. Hierarchical Firewall Policy
2. Network Firewall policy 
3. VPC Firewall rules 


## VPC Firewall rules 

Lets start with the basic fundamental element which is **Firewall Rules** . As the the name indicates firewall rules is nothing but a sets of rules dictates on how the traffic flows

Lets try to see some of the important components in the Firewalls


| Component | Description |
|-----------|-------------|
| Direction | Ingress (incoming traffic) and Egress (outgoing traffic) |
| Source/Destination | For ingress rules, specify the source from which traffic is accepted. For egress rules, specify the destination to which traffic is allowed. |
| Protocol and Ports | Specifies which protocol and port the rule is applied to |
| Action on Match | Action to perform when a rule matches; options are deny or allow |
| Priority | Integers assigned to rules; lower numbers indicate higher priority |



Before starting with the hands on , I want to specify one more things. In GCP there are two firewall rules which will be present no matter what 
- Implicit Egress allow - This means all the egress traffics are default allowed 
- Implicit Ingress deny - This means all the ingress traffics are default denied

You may ask , but this is a security issues right ? I don't want Egress traffic to be allowed. 

Note the default implicit egress and Ingress allow are created with the lowest priority `65535` so we can override them with our custom firewall rules

Enough of this theory lets get started with the hands on.

First create the Custom VPC using the below command 


```bash
gcloud compute networks create custom-network --subnet-mode=auto
```

By default when you create the custom VCP only the two implicit firewall rules will be present. Next create the vm in the custom VPC that we have created

```bash
gcloud compute instances create test-vm \
    --project=<project> \
    --zone=us-central1-c \
    --machine-type=e2-micro \
    --network-interface=network-tier=PREMIUM,stack-type=IPV4_ONLY,subnet=custom-network \
    --provisioning-model=STANDARD \
    --no-service-account \
    --no-scopes
```
> Replace the project Name with your actual project name 

Once it is done Lets try to ssh into the created VM

```
gcloud compute ssh test-vm --zone us-central1-c
```

If you are doing first time it will generate the SSH keys and put the ssh keys into the projects and configure the VM with the ssh key

> Note during the creation process press Y for everything and leave the options default

After sometime we will get timeout error . If you remember correctly by default the ingress traffic is denied 

Lets create the VPC firewall rules to allow ssh 

```bash
gcloud compute firewall-rules create ssh-allow --network custom-network --allow tcp:22
```
After executing the above command if you try to ssh into the vms again using the same command you will be ssh into the VM

> Note the default traffic direction is ingress so we don't need to explicitly specify

### Targets in Firewall Rules 

While creating firewall rules you have to specify on which network the rules should be created and also we can specify on which instances the rules are applicable . Below are the choices
    - All instances in the network
    - Instance with the particular service account
    - Instance with the particular tags

## Firewalls Policies

Firewall policies is nothing but the group of firewall together. Think it like a containers for the firewall rules. Another advantages of the firewall policies is we can apply the firewall policies to the multiple VPCs in the project . This allows the centralized management of the firewalls where we have to manage 100s of rules across multiple VPCs.

Firewall policies in the GCP are two types 
    - Global Policies (Applicable to all regions in the VPC)
    - Regional Policies(Only applicable to the specific regions in the VPC)

Before starting with this hands on lets go ahead and delete the previous ssh rules that we have created

```bash
gcloud compute firewall-rules delete ssh-allow
```

There are three components in the GCP Global Firewall policies
- Policies - List of Firewall rules
- Rules - Actual firewall rules. (Note the configurations of the firewall here is same as VPC firewall rules we discussed before but there are few differences there, which you can find it [here](https://cloud.google.com/firewall/docs/network-firewall-policies))
- Association - which creates the binding between the policies and the actual VPC


Policy is nothing but the container that has set of rules. In this section we will create the firewall rules which allows the ICMP ingress traffic to be allowed 

Lets get started. First create the VPC firewall policy 

```bash
gcloud compute network-firewall-policies create \
    global-policies \
    --description "This is the global policy" --global
```

Next create the association with the firewalls policies

```bash
gcloud compute network-firewall-policies associations create \
    --firewall-policy global-policies \
    --network custom-network \
    --global-firewall-policy
```

Before creating the rules lets try to ping the VM and see if the ICMP traffics are reaching

```bash
VM1_IP=$(gcloud compute instances describe test-vm --format='get(networkInterfaces[0].accessConfigs[0].natIP)' --zone=us-central1-c)
```

Lets try to ping with external IP 

```
 ping -c3 -W 10 $VM1_IP
 ```

 ```
 3 packets transmitted, 0 received, 100% packet loss, time 2032ms
 ```
 You can see we are not able send the traffic

Next create the firewall rules to allow ICMP traffic

```bash
gcloud compute network-firewall-policies rules create 1000 \
    --action allow  \
    --description "allow-icmp-traffic" \
     --layer4-configs=icmp \
    --firewall-policy global-policies \
    --global-firewall-policy \
    --src-ip-ranges 0.0.0.0/0 
    
```

Now try to ping Again

```bash
ping -c3 -W 10 $VM1_IP
```

This time we will be able to successfully ping again. But you may why I need to use the firewall policy I could have done the same in the VPC firewall Rules. Lets try to see the couple of the important features that firewall policies provides

### Firewall Association 

Lets say if you want to attach these policies with the other VPC networks , all you have to do is 

```
gcloud compute network-firewall-policies associations create \
    --firewall-policy global-policies \
    --network custom-network \
    --global-firewall-policy
```

Where in the firewall rules we have to copy the firewall rules to the target VPC and also maintainance going to be PITA as we have to maintain the multiple copies of the same rules.

### Go_Next

During VPC firewall we say that we can either allow or deny the traffic but incase of the Network Firewall rules it supports the other two options 
    - apply_security_profile_group transparently intercepts the traffic and sends it to the configured firewall endpoint for Layer 7 inspection.
    - goto_next : Simply says continue to process the rules in the below level(Note if you get confused don't worry you will be get enough clarity once we move to the hands on section)


### Regional Firewall policies

Its is similar to the Global firewall but the only difference its applicable to the regions that is created

Lets see how the Regional Firewall policies and the Go_Next statement works together

First create the firewall rules with the go to statement

```bash
gcloud compute network-firewall-policies rules create 2000 \
    --action allow  \
    --description "delegate-ingress-traffic"  \
     --layer4-configs=tcp:22 \
    --firewall-policy global-policies \
    --global-firewall-policy \
    --src-ip-ranges 0.0.0.0/0
```

Basically here what we are doing 


![alt text](image.png)

> Note the order in the image is not correct but the concept is same



Similar to the Global network policies we have to create the Policy, association and the firewalls


```bash
gcloud compute network-firewall-policies create \
    regional-policy --region=us-central1 \
    --description "Regional network firewall policy with rules that apply to all VMs in us-central1"
```

```
gcloud compute network-firewall-policies associations create \
    --firewall-policy regional-policy \
    --network custom-network \
    --firewall-policy-region=us-central1
```

Next create the firewall rules

```bash
gcloud compute network-firewall-policies rules create 1000 \
    --action allow \
    --firewall-policy regional-policy  \
    --description allow-internal-traffic \
    --direction INGRESS \
    --src-ip-ranges 0.0.0.0/0 \
    --layer4-configs tcp:22 \
    --firewall-policy-region=us-central1 
```

Next try to ssh into the vms

```
gcloud compute ssh test-vm --zone us-central1-c
```

Lets create the another vm in the Asia region and try to see if we can ssh

```bash
gcloud compute instances create test-vm-2 \
    --project=<project> \
    --zone=asia-south1-a \
    --machine-type=e2-micro \
    --network-interface=network-tier=PREMIUM,stack-type=IPV4_ONLY,subnet=custom-network \
    --provisioning-model=STANDARD \
    --no-service-account \
    --no-scopes
```

> replace the Project-name with your project name 

Next try to ssh into the instance

```bash
gcloud compute ssh test-vm-2 --zone asia-south1-a
```

You will get the error because the regional policy is applicable to only to the regions

Lets try to see if we can ping 

```bash
VM2_IP=$(gcloud compute instances describe test-vm-2 --format='get(networkInterfaces[0].accessConfigs[0].natIP)' --zone=asia-south1-a)
```


```bash
ping -c3 -W 10 $VM2_IP
```
We will be able to ping because the Global firewall policies

## Hierarchical Firewall policy

The Last firewall type we are going to see is Hierarchical firewall where we can assign the policy to whole organization or we can assign it to the folders. This will be very useful if you are working in the large organization where we have to apply the policies throughout the organization 

Lets take the scenario where we want to restrict the traffic to `https://www.google.com/` throughout the organization we can do it via the hierarchial policy 

Enough of theory lets get started .

> Note in order to do the following hands on you need google organization account 

First create the firewall policy using the below command


```bash
gcloud compute firewall-policies create \
     --organization=<org-id> \
     --short-name="org-firewall-policy" \
     --description="rules that apply to all VMs in the organization"
```
Replace the org id with your org id . You can find the org id using the below command 

```bash
gcloud organizations list
```
Next create the firewall rule that block that egress traffic for the google.com


```bash
gcloud compute firewall-policies rules create 1000 \
    --action=deny \
    --direction=EGRESS \
    --dest-fqdns=www.google.com. \
    --description="block google.com" \
    --layer4-configs all \
    --firewall-policy=org-firewall-policy \
    --organization=<org-id>
```

Next associate the firewall policy with the org


```
gcloud compute firewall-policies associations create \
    --organization=<org-id> \
    --firewall-policy="org-firewall-policy"
```

Now ssh into the vm 

```
gcloud compute ssh test-vm --zone us-central1-c
```

```bash
curl -m 2 -I www.google.com
```

You can see we are getting the time out . This is how we can leverage the Hierarchical policy on the GCP 

Thats it folks . I hope you learned something out of the blog if you folks have any suggestions or questions feel free to reach out to me .

### Clean up 

```bash
gcloud compute instances delete test-vm --zone us-central1-c
```

```bash
gcloud compute instances delete test-vm-2 --zone asia-south1-a
```
For firewall policies, I recommend you to go to the UI and delete the resources or if you are lazy like me delete the whole project xD. 