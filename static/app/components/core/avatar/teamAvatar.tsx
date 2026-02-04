import type React from 'react';

import type {Team} from 'sentry/types/organization';
import {explodeSlug} from 'sentry/utils';

import {
  Avatar,
  type AvatarProps,
  type GravatarBaseAvatarProps,
  type LetterBaseAvatarProps,
  type UploadBaseAvatarProps,
} from './avatar';

export interface TeamAvatarProps extends AvatarProps {
  team: Team;
  ref?: React.Ref<HTMLSpanElement | SVGSVGElement | HTMLImageElement>;
}

export function TeamAvatar({ref, team, tooltip: tooltipProp, ...props}: TeamAvatarProps) {
  const slug = team?.slug || '';
  const title = explodeSlug(slug);
  const tooltip = tooltipProp ?? `#${title}`;

  return <Avatar ref={ref} tooltip={tooltip} {...props} {...getTeamAvatarProps(team)} />;
}

function getTeamAvatarProps(
  team: Team
): LetterBaseAvatarProps | UploadBaseAvatarProps | GravatarBaseAvatarProps {
  if (!team.avatar?.avatarType) {
    return {
      type: 'letter_avatar',
      letterId: team.slug,
      title: team.name,
    };
  }

  switch (team.avatar?.avatarType) {
    case 'letter_avatar':
      return {
        type: 'letter_avatar',
        letterId: team.slug,
        title: team.name,
      };
    case 'upload':
      if (!team.avatar?.avatarUrl) {
        return {
          type: 'letter_avatar',
          letterId: team.slug,
          title: team.name,
        };
      }
      return {
        type: 'upload',
        uploadUrl: team.avatar?.avatarUrl,
      };
    case 'gravatar':
      if (!team.avatar?.avatarUrl) {
        return {
          type: 'letter_avatar',
          letterId: team.slug,
          title: team.name,
        };
      }
      return {
        type: 'gravatar',
        gravatarId: team.avatar.avatarUrl,
      };
    default:
      return {
        type: 'letter_avatar',
        letterId: team.slug,
        title: team.name,
      };
  }
}
