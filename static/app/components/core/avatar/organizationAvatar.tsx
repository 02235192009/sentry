import * as Sentry from '@sentry/react';

import type {OrganizationSummary} from 'sentry/types/organization';
import {explodeSlug} from 'sentry/utils';

import {
  Avatar,
  type AvatarProps,
  type GravatarBaseAvatarProps,
  type LetterBaseAvatarProps,
  type UploadBaseAvatarProps,
} from './avatar';

interface OrganizationAvatarProps extends AvatarProps {
  organization: OrganizationSummary | undefined;
  ref?: React.Ref<HTMLSpanElement>;
}

export function OrganizationAvatar({
  ref,
  organization,
  ...props
}: OrganizationAvatarProps) {
  if (!organization) {
    // @TODO(jonasbadalic): Do we need a placeholder here?
    Sentry.captureMessage('OrganizationAvatar: organization summary is undefined');
    return null;
  }

  return (
    <Avatar
      ref={ref}
      tooltip={organization.slug ?? ''}
      title={explodeSlug(organization.slug ?? '')}
      {...props}
      {...getOrganizationAvatarProps(organization)}
    />
  );
}

function getOrganizationAvatarProps(
  organization: OrganizationSummary
): LetterBaseAvatarProps | UploadBaseAvatarProps | GravatarBaseAvatarProps {
  if (!organization.avatar?.avatarType) {
    return {
      type: 'letter_avatar',
      letterId: organization.slug,
      title: organization.name,
    };
  }

  switch (organization.avatar?.avatarType) {
    case 'letter_avatar':
      return {
        type: 'letter_avatar',
        letterId: organization.slug,
        title: organization.name,
      };
    case 'upload':
      if (!organization.avatar?.avatarUrl) {
        return {
          type: 'letter_avatar',
          letterId: organization.slug,
          title: organization.name,
        };
      }
      return {
        type: 'upload',
        uploadUrl: organization.avatar?.avatarUrl,
      };
    case 'gravatar':
      if (!organization.avatar?.avatarUrl) {
        return {
          type: 'letter_avatar',
          letterId: organization.slug,
          title: organization.name,
        };
      }
      return {
        type: 'gravatar',
        gravatarId: organization.avatar.avatarUrl,
      };
    default:
      return {
        type: 'letter_avatar',
        letterId: organization.slug,
        title: organization.name,
      };
  }
}
