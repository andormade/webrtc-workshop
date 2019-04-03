export function createReceiver(textareaOffer, textareaAnswer, streamCallback) {
	const server = {
		urls: 'stun:stun.l.google.com:19302',
	};

	const receiver = new RTCPeerConnection({
		iceServers: [server],
	});

	async function onOfferReady(e) {
		if (e.keyCode !== 13 || receiver.signalingState !== 'stable') {
			return;
		}
		const desc = new RTCSessionDescription({
			type: 'offer',
			sdp: atob(textareaOffer.value),
		});
		await receiver.setRemoteDescription(desc);
		const answer = await receiver.createAnswer();
		receiver.setLocalDescription(answer);
	}

	function onStreamReady(e) {
		streamCallback(e.stream);
	}

	function onAnswerReady(e) {
		if (e.candidate) {
			return;
		}
		textareaAnswer.value = btoa(receiver.localDescription.sdp);
	}

	receiver.addEventListener('addstream', onStreamReady);
	receiver.addEventListener('icecandidate', onAnswerReady);
	textareaOffer.addEventListener('keypress', onOfferReady);
}
