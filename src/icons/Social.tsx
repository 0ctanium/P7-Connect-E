/* eslint-disable @next/next/no-img-element */
import React, {FC, HTMLAttributes} from 'react'
import {ClientSafeProvider, LiteralUnion} from "next-auth/react";
import {BuiltInProviderType} from "next-auth/providers";

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

export const circledSocialIcons: { [p in LiteralUnion<BuiltInProviderType>]?: SocialIconType } = {
    apple: CircledAppleIcon,
    google: CircledGoogleIcon,
    slack: CircledSlackIcon,
    facebook: CircledFacebookIcon,
    twitter: CircledTwitterIcon,
    linkedin: CircledLinkedInIcon,
}

export const socialIcons: { [p in LiteralUnion<BuiltInProviderType>]?: SocialIconType } = {
    apple: AppleIcon,
    google: GoogleIcon,
    slack: SlackIcon,
    facebook: FacebookIcon,
    twitter: TwitterIcon,
    linkedin: LinkedInIcon,
}

export const SocialIcon: SocialIconType<{ provider: LiteralUnion<BuiltInProviderType>, circled?: boolean }> = ({ provider, circled, ...props}) => {
    const Icon = circled ? circledSocialIcons[provider] : socialIcons[provider]

    if(Icon) {
        return <Icon {...props} />
    } else {
        return <span>Icon not found</span>
    }
}
