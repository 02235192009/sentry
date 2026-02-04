import type React from 'react';
import styled from '@emotion/styled';
import classNames from 'classnames';

import {Tooltip, type TooltipProps} from '@sentry/scraps/tooltip';

// eslint-disable-next-line no-relative-import-paths/no-relative-import-paths
import {Gravatar} from '../gravatar/gravatar';
// eslint-disable-next-line no-relative-import-paths/no-relative-import-paths
import {ImageAvatar} from '../imageAvatar/imageAvatar';
// eslint-disable-next-line no-relative-import-paths/no-relative-import-paths
import {LetterAvatar} from '../letterAvatar/letterAvatar';

const DEFAULT_REMOTE_SIZE = 120;

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * Enable to display tooltips.
   */
  hasTooltip?: boolean;
  letterId?: string;
  ref?: React.Ref<HTMLSpanElement | SVGSVGElement | HTMLImageElement>;
  /**
   * Should avatar be round instead of a square
   */
  round?: boolean;
  size?: number;
  suggested?: boolean;
  title?: string;
  /**
   * The content for the tooltip. Requires hasTooltip to display
   */
  tooltip?: React.ReactNode;
  /**
   * Additional props for the tooltip
   */
  tooltipOptions?: Omit<TooltipProps, 'children' | 'title'>;
}

export interface GravatarBaseAvatarProps extends AvatarProps {
  gravatarId: string;
  type: 'gravatar';
}

export interface LetterBaseAvatarProps extends AvatarProps {
  letterId: string;
  type: 'letter_avatar';
}

export interface UploadBaseAvatarProps extends AvatarProps {
  type: 'upload';
  uploadUrl: string;
}

function Avatar({
  className,
  size,
  style,
  title,
  tooltip,
  tooltipOptions,
  hasTooltip = false,
  round = false,
  ref,
  ...props
}: GravatarBaseAvatarProps | LetterBaseAvatarProps | UploadBaseAvatarProps) {
  return (
    <Tooltip title={tooltip} disabled={!hasTooltip} {...tooltipOptions} skipWrapper>
      <AvatarContainer
        ref={ref as React.Ref<HTMLSpanElement>}
        data-test-id={`${props.type}-avatar`}
        className={classNames('avatar', className)}
        round={!!round}
        suggested={!!props.suggested}
        style={{...(size ? {height: size, width: size} : {}), ...style}}
        title={title}
        {...props}
      >
        {props.type === 'upload' ? (
          <ImageAvatar
            round={round}
            alt={title ?? ''}
            ref={ref as React.Ref<HTMLImageElement>}
            src={props.uploadUrl}
            suggested={props.suggested}
          />
        ) : props.type === 'gravatar' ? (
          <Gravatar
            ref={ref as React.Ref<HTMLImageElement>}
            round={round}
            title={title ?? ''}
            gravatarId={props.gravatarId}
            remoteSize={DEFAULT_REMOTE_SIZE}
            suggested={props.suggested}
          />
        ) : (
          <LetterAvatar
            ref={ref as React.Ref<SVGSVGElement>}
            round={round}
            displayName={title === '[Filtered]' ? '?' : title}
            identifier={props.letterId}
            suggested={props.suggested}
          />
        )}
      </AvatarContainer>
    </Tooltip>
  );
}

// Note: Avatar will not always be a child of a flex layout, but this seems like a
// sensible default.
const AvatarContainer = styled('span')<{
  round: boolean;
  suggested: boolean;
}>`
  flex-shrink: 0;
  border-radius: ${p => (p.round ? '50%' : '3px')};
  border: ${p =>
    p.suggested ? `1px dashed ${p.theme.tokens.border.neutral.vibrant}` : 'none'};
  background-color: ${p => (p.suggested ? p.theme.tokens.background.primary : 'none')};
`;
