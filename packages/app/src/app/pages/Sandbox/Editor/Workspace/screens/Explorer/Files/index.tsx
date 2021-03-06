import React from 'react';
import { useOvermind } from 'app/overmind';
import { getModulePath } from '@codesandbox/common/lib/sandbox/modules';
import { Collapsible, SidebarRow } from '@codesandbox/components';
import css from '@styled-system/css';

import DirectoryEntry from './DirectoryEntry/index';
import EditIcons from './DirectoryEntry/Entry/EditIcons';

export const Files = ({ defaultOpen = null }) => {
  const {
    state: { editor: editorState, isLoggedIn },
    actions: { editor, files },
  } = useOvermind();

  const [editActions, setEditActions] = React.useState(null);

  const { currentSandbox: sandbox } = editorState;

  const _getModulePath = moduleId => {
    try {
      return getModulePath(sandbox.modules, sandbox.directories, moduleId);
    } catch (e) {
      return '';
    }
  };

  return (
    <>
      <Collapsible
        title="Files"
        defaultOpen={defaultOpen}
        css={{ position: 'relative' }}
      >
        <SidebarRow
          justify="flex-end"
          css={css({
            // these could have been inside the collapsible as "actions"
            // but this is the only exception where we have actions in the
            // collapsible header. Keeping them in the body, also lets us
            // get the animation effect of open/close state on it's own
            // If this UI pattern catches on, it would be a good refactor
            // to add actions API to collapsible
            position: 'absolute',
            top: 0,
            right: 2,
          })}
        >
          {editActions}
        </SidebarRow>
        <DirectoryEntry
          root
          getModulePath={_getModulePath}
          title={sandbox.title || 'Project'}
          signals={{ files, editor }}
          store={{ editor: editorState, isLoggedIn }}
          initializeProperties={({
            onCreateModuleClick,
            onCreateDirectoryClick,
            onUploadFileClick,
          }) => {
            if (setEditActions) {
              setEditActions(
                // @ts-ignore
                <EditIcons
                  hovering
                  forceShow={window.__isTouch}
                  onCreateFile={onCreateModuleClick}
                  onCreateDirectory={onCreateDirectoryClick}
                  onDownload={editor.createZipClicked}
                  onUploadFile={
                    isLoggedIn && sandbox.privacy === 0
                      ? onUploadFileClick
                      : undefined
                  }
                />
              );
            }
          }}
          depth={-1}
          id={null}
          shortid={null}
        />
      </Collapsible>
    </>
  );
};
