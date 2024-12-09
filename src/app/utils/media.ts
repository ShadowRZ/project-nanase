import { SpecVersions } from '../cs-api';

export function suggestsAuthMedia(versions: SpecVersions) {
  const ver_cond = versions.versions.includes('v1.11');
  const unstable_cond =
    (versions.unstable_features ?? {})['org.matrix.msc3916.stable'] ?? false;

  return ver_cond || unstable_cond;
}
