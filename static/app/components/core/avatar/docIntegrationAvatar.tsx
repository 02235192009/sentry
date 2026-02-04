// import {PluginIcon} from 'sentry/plugins/components/pluginIcon';
import type {DocIntegration} from 'sentry/types/integrations';

import {Avatar, type UploadBaseAvatarProps} from './avatar';

interface DocIntegrationAvatarProps extends UploadBaseAvatarProps {
  docIntegration: DocIntegration;
  ref?: React.Ref<HTMLSpanElement>;
}

export function DocIntegrationAvatar({
  ref,
  docIntegration,
  ...props
}: DocIntegrationAvatarProps) {
  return (
    <Avatar
      {...props}
      ref={ref}
      type="upload"
      title={docIntegration?.name}
      uploadUrl={docIntegration?.avatar?.avatarUrl ?? ''}
      // backupAvatar={
      //   <PluginIcon size={props.size} pluginId={docIntegration?.slug ?? ''} />
      // }
    />
  );
}
