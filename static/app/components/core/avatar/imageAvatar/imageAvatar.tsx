import styled from '@emotion/styled';

import {Image, type ImageProps} from '@sentry/scraps/image';

// eslint-disable-next-line no-relative-import-paths/no-relative-import-paths
import {baseAvatarStyles, type BaseAvatarStyleProps} from '../avatarComponentStyles';

interface ImageAvatarProps extends ImageProps, BaseAvatarStyleProps {}

export function ImageAvatar({src, ...props}: ImageAvatarProps) {
  // @todo add fallback to letter avatar if image has error
  return <StyledImage src={src} {...props} />;
}

const StyledImage = styled(Image)<BaseAvatarStyleProps>`
  ${baseAvatarStyles};
`;
