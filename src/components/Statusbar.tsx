import * as React from "react";
import { observer, inject } from 'mobx-react';
import { InputGroup, ControlGroup, Button, ButtonGroup, Popover, Intent, Alert, ProgressBar, Classes, Tooltip } from '@blueprintjs/core';
import { Directory } from "../services/Fs";
import { AppState } from "../state/appState";
import { AppToaster } from "./AppToaster";

interface InjectedProps {
    fileCache: Directory;
    appState: AppState
}

@inject('fileCache', 'appState')
@observer
export class Statusbar extends React.Component {
    private input: HTMLInputElement | null = null;

    constructor(props: any) {
        super(props);
    }

    private get injected() {
        return this.props as InjectedProps;
    }

    private onClipboardCopy = () => {
        const { fileCache, appState } = this.injected;

        const elements = fileCache.selected.map((file) => file.fullname);

        appState.setClipboard('local', fileCache.path, elements);

        AppToaster.show({
            message: `${elements.length} element(s) copied to the clipboard`,
            icon: "tick",
            intent: Intent.SUCCESS
        });
    }

    private refHandler = (input: HTMLInputElement) => {
        this.input = input;
    }

    public render() {
        const { fileCache } = this.injected;
        const disabled = !fileCache.selected.length;
        const numDirs = fileCache.files.filter((file) => file.fullname !== '..' && file.isDir).length;
        const numFiles = fileCache.files.filter((file) => !file.isDir).length;
        const numSelected = fileCache.selected.length;

        const pasteButton = (
            <Tooltip content={`Copy ${numSelected} file(s) to the clipboard`} disabled={disabled}>
            <Button
                disabled={disabled}
                icon="clipboard"
                intent={!disabled && Intent.PRIMARY || Intent.NONE}
                onClick={this.onClipboardCopy}
                minimal={true}
            />
        </Tooltip>);

        return (
            <ControlGroup>
                <InputGroup
                        disabled
                        leftIcon="database"
                        rightElement={pasteButton}
                        value={`${numFiles} File(s), ${numDirs} Folder(s)`}
                        inputRef={this.refHandler}
                />
            </ControlGroup>
        )
    }
}