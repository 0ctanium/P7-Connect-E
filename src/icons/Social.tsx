/* eslint-disable @next/next/no-img-element */
import React, {FC, HTMLAttributes, HTMLProps} from 'react'
import {AccountProvider} from "../constants/provider";

type SocialIconType<P = {}> = FC<HTMLAttributes<unknown> & P>

export const CircledAppleIcon: SocialIconType = (props) => <p {...props}>Apple</p>
export const CircledGoogleIcon: SocialIconType = ({ className, ...props}) => <div {...props} className={'rounded-full bg-white p-1 ' + className}><img src="/icons/social/google.svg" alt="Google" /></div>
export const CircledSlackIcon: SocialIconType = ({ className, ...props}) => <div {...props} className={'rounded-full bg-white p-1 ' + className}><img src="/icons/social/slack.svg" alt="Slack" /></div>
export const CircledFacebookIcon: SocialIconType = (props) => <img {...props} src="/icons/social/facebook-circled.svg" alt="Facebook" />
export const CircledTwitterIcon: SocialIconType = (props) => <img {...props} src="/icons/social/twitter-circled.svg" alt="Twitter" />
export const CircledLinkedInIcon: SocialIconType = (props) => <img {...props} src="/icons/social/linkedin-circled.svg" alt="LinkedIn" />


export const AppleIcon: SocialIconType = (props) => <p {...props}>Apple</p>
export const GoogleIcon: SocialIconType = (props) => <img {...props} src="/icons/social/google.svg" alt="Google" />
export const SlackIcon: SocialIconType = (props) => <img {...props} src="/icons/social/slack.svg" alt="Slack" />

export const FacebookIcon: SocialIconType = (props) => <img {...props} src="/icons/social/facebook.svg" alt="Facebook" />
export const TwitterIcon: SocialIconType = (props) => <img {...props} src="/icons/social/twitter.svg" alt="Twitter" />
export const LinkedInIcon: SocialIconType = ({ className, ...props}) => <div {...props} className={'p-0.5 ' + className}><img src="/icons/social/linkedin-square.svg" alt="LinkedIn" /></div>

export const circledSocialIcons: Record<AccountProvider, SocialIconType> = {
    [AccountProvider.Apple]: CircledAppleIcon,
    [AccountProvider.Google]: CircledGoogleIcon,
    [AccountProvider.Slack]: CircledSlackIcon,
    [AccountProvider.Facebook]: CircledFacebookIcon,
    [AccountProvider.Twitter]: CircledTwitterIcon,
    [AccountProvider.LinkedIn]: CircledLinkedInIcon,
}

export const socialIcons: Record<AccountProvider, SocialIconType> = {
    [AccountProvider.Apple]: AppleIcon,
    [AccountProvider.Google]: GoogleIcon,
    [AccountProvider.Slack]: SlackIcon,
    [AccountProvider.Facebook]: FacebookIcon,
    [AccountProvider.Twitter]: TwitterIcon,
    [AccountProvider.LinkedIn]: LinkedInIcon,
}

export const SocialIcon: SocialIconType<{ provider: AccountProvider, circled?: boolean }> = ({ provider, circled, ...props}) => {
    const Icon = circled ? circledSocialIcons[provider] : socialIcons[provider]

    if(Icon) {
        return <Icon {...props} />
    } else {
        return <span>Icon not found</span>
    }
}
