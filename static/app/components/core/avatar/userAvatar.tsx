import type React from 'react';

import type {Actor} from 'sentry/types/core';
import type {AvatarUser} from 'sentry/types/user';
import {userDisplayName} from 'sentry/utils/formatters';

import {
  Avatar,
  type GravatarBaseAvatarProps,
  type LetterBaseAvatarProps,
  type UploadBaseAvatarProps,
} from './avatar';

export interface UserAvatarProps extends UploadBaseAvatarProps {
  user: Actor | AvatarUser | undefined;
  gravatar?: boolean;
  ref?: React.Ref<HTMLSpanElement | SVGSVGElement | HTMLImageElement>;
  renderTooltip?: (user: AvatarUser | Actor) => React.ReactNode;
}

export function UserAvatar({
  ref,

  // Default gravatar to false in order to support transparent avatars
  // Avatar falls through to letter avatars if a remote image fails to load,
  // however gravatar sends back a transparent image when it does not find a gravatar,
  // so there's little we have to control whether we need to fallback to letter avatar
  gravatar = false,

  renderTooltip,
  user,
  ...props
}: UserAvatarProps) {
  if (!user) {
    // @TODO(jonasbadalic): Do we need a placeholder here?
    return null;
  }

  let tooltip: React.ReactNode = null;

  if (renderTooltip) {
    tooltip = renderTooltip(user);
  } else if (props.tooltip) {
    tooltip = props.tooltip;
  } else {
    tooltip = userDisplayName(user);
  }

  return <Avatar ref={ref} tooltip={tooltip} {...getUserAvatarProps(user)} />;
}

function getUserAvatarProps(
  user: Actor | AvatarUser
): GravatarBaseAvatarProps | LetterBaseAvatarProps | UploadBaseAvatarProps {
  if (isActor(user)) {
    return {
      type: 'letter_avatar',
      letterId: user.name,
      title: user.name,
    };
  }

  switch (user.avatar?.avatarType) {
    case 'letter_avatar':
      return {
        type: 'letter_avatar',
        letterId: user.email || user.username || user.id || user.ip_address,
        title: user.name || user.email || user.username || '',
      };
    case 'upload':
      return {
        type: 'upload',
        uploadUrl: user.avatar?.avatarUrl ?? '',
      };
    case 'gravatar':
      if (!user.email) {
        return {
          type: 'letter_avatar',
          letterId: user.email || user.username || user.id || user.ip_address,
          title: user.name || user.email || user.username || '',
        };
      }
      return {
        type: 'gravatar',
        gravatarId: user.email.toLowerCase(),
      };
    default:
      return {
        type: 'letter_avatar',
        letterId: user.email || user.username || user.id || user.ip_address,
        title: user.name || user.email || user.username || '',
      };
  }
}

function isActor(maybe: AvatarUser | Actor): maybe is Actor {
  return typeof (maybe as AvatarUser).email === 'undefined';
}
