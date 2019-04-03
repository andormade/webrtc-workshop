export async function createUnicaster(textareaOffer, textareaAnswer, stream) {
	const server = {
		urls: 'stun:stun.l.google.com:19302',
	};

	const unicaster = new RTCPeerConnection({
		iceServers: [server],
	});

	function onSdpOfferToReceiverIsReady(e) {
		if (e.candidate) {
			return;
		}
		textareaOffer.value = btoa(unicaster.localDescription.sdp);
	}

	function onAnswerFromReceiver(e) {
		if (e.keyCode !== 13 || unicaster.signalingState != 'have-local-offer') {
			return;
		}
		const desc = new RTCSessionDescription({
			type: 'answer',
			sdp: atob(textareaAnswer.value),
		});
		unicaster.setRemoteDescription(desc);
	}

	unicaster.addEventListener('icecandidate', onSdpOfferToReceiverIsReady);
	textareaAnswer.addEventListener('keypress', onAnswerFromReceiver);

	unicaster.addStream(stream);
	const offer = await unicaster.createOffer();
	unicaster.setLocalDescription(offer);
}
