import type {AvatarConfig} from "../lib/types";

export interface AvatarDataAdapter {
    saveConfig(ownerId: string, config: AvatarConfig): Promise<void>;
}
