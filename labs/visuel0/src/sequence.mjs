export function decideFrameApplication(currentSequence, incomingFrame) {
  if (!incomingFrame || typeof incomingFrame !== 'object') {
    throw new TypeError('incomingFrame must be an object');
  }

  if (incomingFrame.mode === 'full') {
    return {
      action: 'replace',
      nextSequence: incomingFrame.sequence,
      reason: currentSequence === null ? 'initial-full-state' : 'authoritative-full-state'
    };
  }

  if (incomingFrame.mode !== 'delta') {
    return {
      action: 'resync',
      nextSequence: currentSequence,
      reason: 'unsupported-frame-mode'
    };
  }

  if (currentSequence === null) {
    return {
      action: 'resync',
      nextSequence: null,
      reason: 'delta-without-base-state'
    };
  }

  if (incomingFrame.base_sequence !== currentSequence) {
    return {
      action: 'resync',
      nextSequence: currentSequence,
      reason: 'base-sequence-mismatch'
    };
  }

  if (!Number.isInteger(incomingFrame.sequence) || incomingFrame.sequence <= currentSequence) {
    return {
      action: 'resync',
      nextSequence: currentSequence,
      reason: 'non-forward-sequence'
    };
  }

  return {
    action: 'apply-delta',
    nextSequence: incomingFrame.sequence,
    reason: 'compatible-delta'
  };
}
